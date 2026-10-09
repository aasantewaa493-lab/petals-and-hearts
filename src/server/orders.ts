import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/db";
import { calculateQuote } from "@/lib/pricing";
import { isDeliveryDateAvailable } from "@/lib/delivery";
import { assertTransition } from "@/lib/order-status";
import { getPaymentProvider } from "@/lib/payments";
import { getEnv } from "@/lib/env";
import { formatMoney } from "@/lib/money";
import { orderEmail, sendEmail } from "@/lib/email";
import type { OrderStatus, SubstitutionPolicy } from "@prisma/client";
import type { checkoutSchema } from "@/schemas/forms";
import type { z } from "zod";

const orderRef = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function createPendingOrder(cartId: string, input: CheckoutInput, userId?: string) {
  const cart = await prisma.cart.findUniqueOrThrow({
    where: { id: cartId },
    include: { items: { include: { product: true, variant: true } } },
  });
  if (cart.items.length === 0) throw new Error("Your bag is empty.");

  for (const item of cart.items) {
    if (!item.product.isActive) throw new Error(`${item.product.name} is no longer available.`);
    const stock = item.variant?.stockQuantity ?? item.product.stockQuantity;
    if (item.product.availability === "UNAVAILABLE" || stock < item.quantity) {
      throw new Error(`${item.product.name} does not have enough stock.`);
    }
  }

  const zone = await prisma.deliveryZone.findFirst({
    where: { id: input.zoneId, isActive: true },
  });
  if (!zone) throw new Error("Choose a valid delivery zone.");

  const deliveryDate = new Date(input.deliveryDate);
  const reserved = await prisma.order.count({
    where: {
      deliveryDate,
      status: { in: ["PAID", "PROCESSING", "READY_FOR_DISPATCH", "OUT_FOR_DELIVERY"] },
    },
  });
  if (
    !isDeliveryDateAvailable(deliveryDate, {
      feePesewas: zone.feePesewas,
      cutoffHour: zone.cutoffHour,
      leadDays: zone.leadDays,
      sameDay: zone.sameDay,
      dailyCapacity: zone.dailyCapacity,
      reservedForDate: reserved,
    })
  ) {
    throw new Error("That delivery date is no longer available.");
  }

  const promo = input.promoCode
    ? await prisma.promotion.findUnique({ where: { code: input.promoCode.toUpperCase() } })
    : cart.promoCode
      ? await prisma.promotion.findUnique({ where: { code: cart.promoCode.toUpperCase() } })
      : null;
  const now = new Date();
  const validPromo =
    promo && promo.isActive && promo.startsAt <= now && promo.endsAt >= now ? promo : null;

  const quote = calculateQuote({
    lines: cart.items.map((item) => ({
      unitPesewas: item.variant?.pricePesewas ?? item.product.pricePesewas,
      quantity: item.quantity,
    })),
    promotion: validPromo,
    deliveryPesewas: zone.feePesewas,
  });

  const reference = `PH-${orderRef()}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        reference,
        userId: userId ?? null,
        email: input.email.toLowerCase(),
        phone: input.phone,
        currency: "GHS",
        subtotalPesewas: quote.subtotalPesewas,
        discountPesewas: quote.discountPesewas,
        deliveryPesewas: quote.deliveryPesewas,
        taxPesewas: quote.taxPesewas,
        totalPesewas: quote.totalPesewas,
        promoCode: validPromo?.code,
        giftMessage: input.giftMessage,
        deliveryDate,
        deliveryWindow: input.deliveryWindow,
        deliveryInstructions: input.deliveryInstructions,
        substitutionPolicy: input.substitutionPolicy as SubstitutionPolicy,
        needsStaffReview: input.substitutionPolicy === "CONTACT_CUSTOMER",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            variantName: item.variant?.name,
            quantity: item.quantity,
            unitPesewas: item.variant?.pricePesewas ?? item.product.pricePesewas,
            linePesewas: (item.variant?.pricePesewas ?? item.product.pricePesewas) * item.quantity,
            personalization: {
              giftMessage: item.giftMessage,
              recipientName: item.recipientName,
              deliveryDate: item.deliveryDate,
              options: item.personalization,
            },
          })),
        },
        addresses: {
          create: [
            {
              kind: "DELIVERY",
              fullName: input.recipientName,
              phone: input.phone,
              line1: input.line1,
              line2: input.line2,
              city: input.city,
              region: input.region,
              postalCode: input.postalCode,
            },
            {
              kind: "PURCHASER",
              fullName: input.purchaserName,
              phone: input.phone,
              line1: input.line1,
              city: input.city,
              region: input.region,
            },
          ],
        },
        events: { create: { status: "PENDING_PAYMENT", note: "Order created" } },
      },
    });

    const provider = getPaymentProvider();
    const init = await provider.initialize({
      orderId: created.id,
      reference,
      email: input.email,
      amountPesewas: quote.totalPesewas,
      currency: "GHS",
      callbackUrl: `${getEnv().siteUrl}/api/payments/callback?reference=${reference}`,
    });

    await tx.payment.create({
      data: {
        orderId: created.id,
        provider: provider.name,
        providerReference: init.providerReference,
        amountPesewas: quote.totalPesewas,
        currency: "GHS",
        status: "PENDING",
      },
    });

    return { created, authorizationUrl: init.authorizationUrl };
  });

  return order;
}

export async function fulfillVerifiedPayment(providerReference: string, amountPesewas: number) {
  const payment = await prisma.payment.findUnique({
    where: { providerReference },
    include: { order: { include: { items: true } } },
  });
  if (!payment) throw new Error("Payment not found.");
  if (payment.status === "SUCCEEDED") return payment.order;
  if (payment.amountPesewas !== amountPesewas) {
    throw new Error("Paid amount does not match the order.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED" },
    });
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });
    await tx.orderEvent.create({
      data: { orderId: payment.orderId, status: "PAID", note: "Payment verified" },
    });
    if (payment.order.promoCode) {
      const promo = await tx.promotion.findUnique({ where: { code: payment.order.promoCode } });
      if (promo) {
        await tx.promotionRedemption.create({
          data: {
            promotionId: promo.id,
            orderId: payment.orderId,
            userId: payment.order.userId,
          },
        });
      }
    }
    for (const item of payment.order.items) {
      if (!item.productId) continue;
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      await tx.inventoryRecord.updateMany({
        where: { productId: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          delta: -item.quantity,
          reason: "SALE",
          note: payment.order.reference,
        },
      });
    }
    if (payment.orderId) {
      const carts = await tx.cart.findMany({
        where: { userId: payment.order.userId ?? undefined },
      });
      for (const cart of carts) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }
  });

  const order = await prisma.order.findUniqueOrThrow({ where: { id: payment.orderId } });
  await sendEmail(
    orderEmail({
      to: order.email,
      reference: order.reference,
      title: "Payment confirmed",
      intro: "We have verified your payment and your flowers are now in our studio queue.",
      total: formatMoney(order.totalPesewas, order.currency),
    }),
  );
  return order;
}

export async function updateOrderStatus(orderId: string, next: OrderStatus, note?: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  assertTransition(order.status, next);
  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: next } }),
    prisma.orderEvent.create({ data: { orderId, status: next, note } }),
  ]);
  return prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true, events: true } });
}

export async function getOrderByReference(reference: string, email?: string) {
  return prisma.order.findFirst({
    where: {
      reference,
      ...(email ? { email: email.toLowerCase() } : {}),
    },
    include: {
      items: true,
      addresses: true,
      payments: true,
      events: { orderBy: { createdAt: "asc" } },
    },
  });
}
