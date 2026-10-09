"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { getCart, getCartId, mergeCartsOnLogin, quoteCart } from "@/server/cart";
import { createPendingOrder, fulfillVerifiedPayment, getOrderByReference } from "@/server/orders";
import { calculateBouquetPrice } from "@/lib/pricing";
import { bouquetBuilder, type BouquetSelection } from "@/config/bouquet";
import {
  addressSchema,
  checkoutSchema,
  contactSchema,
  forgotPasswordSchema,
  loginSchema,
  newsletterSchema,
  registerSchema,
  resetPasswordSchema,
  reviewSchema,
} from "@/schemas/forms";
import { signIn, signOut } from "@/auth";
import { getSessionUser, requireRole, requireUser } from "@/lib/auth/session";
import { rateLimit } from "@/lib/security/rate-limit";
import { settleMockPayment } from "@/lib/payments/mock";
import { getEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email";

export type ActionState = { ok: boolean; message: string; fieldErrors?: Record<string, string> };

function fail(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { ok: false, message, fieldErrors };
}

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const variantId = String(formData.get("variantId") ?? "") || null;
  const quantity = Number(formData.get("quantity") ?? 1);
  const giftMessage = String(formData.get("giftMessage") ?? "") || null;
  const recipientName = String(formData.get("recipientName") ?? "") || null;
  if (!productId) return;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product?.isActive) return;
  const stock = variantId
    ? (await prisma.productVariant.findUnique({ where: { id: variantId } }))?.stockQuantity ?? 0
    : product.stockQuantity;
  if (quantity < 1 || quantity > stock) return;
  const cartId = await getCartId();
  const existing = await prisma.cartItem.findFirst({
    where: { cartId, productId, variantId },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity, giftMessage, recipientName },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId, productId, variantId, quantity, giftMessage, recipientName },
    });
  }
  revalidatePath("/", "layout");
}

export async function updateCartItemAction(formData: FormData) {
  const id = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  const item = await prisma.cartItem.findUnique({
    where: { id },
    include: { product: true, variant: true },
  });
  if (!item) return;
  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id } });
  } else {
    const stock = item.variant?.stockQuantity ?? item.product.stockQuantity;
    if (quantity > stock) return;
    await prisma.cartItem.update({ where: { id }, data: { quantity } });
  }
  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  await prisma.cartItem.delete({ where: { id: String(formData.get("itemId") ?? "") } });
  revalidatePath("/cart");
}

export async function applyPromoAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const promo = await prisma.promotion.findUnique({ where: { code } });
  const now = new Date();
  if (!promo || !promo.isActive || promo.startsAt > now || promo.endsAt < now) return;
  const cartId = await getCartId();
  await prisma.cart.update({ where: { id: cartId }, data: { promoCode: code } });
  revalidatePath("/cart");
}

export async function addCustomBouquetAction(formData: FormData) {
  const selection: BouquetSelection = {
    size: String(formData.get("size") ?? ""),
    flowers: formData.getAll("flowers").map(String),
    palette: String(formData.get("palette") ?? ""),
    greenery: formData.get("greenery") === "on",
    wrap: String(formData.get("wrap") ?? "silk"),
    card: formData.get("card") === "on",
    message: String(formData.get("message") ?? ""),
    recipientName: String(formData.get("recipientName") ?? ""),
  };
  try {
    calculateBouquetPrice(selection);
  } catch {
    return;
  }
  const product = await prisma.product.findUnique({ where: { slug: "atelier-custom-bouquet" } });
  if (!product) return;
  const cartId = await getCartId();
  await prisma.cartItem.create({
    data: {
      cartId,
      productId: product.id,
      quantity: 1,
      giftMessage: selection.message || null,
      recipientName: selection.recipientName || null,
      personalization: selection,
    },
  });
  revalidatePath("/cart");
}

export async function toggleWishlistFormAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (productId) await toggleWishlistAction(productId);
}

export async function toggleWishlistAction(productId: string): Promise<ActionState> {
  const user = await getSessionUser();
  let wishlist = user?.id
    ? await prisma.wishlist.findFirst({ where: { userId: user.id } })
    : null;
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId: user?.id ?? null } });
  }
  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/", "layout");
    return { ok: true, message: "Removed from saved." };
  }
  await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fail("Check the highlighted fields.");
  const email = parsed.data.email.toLowerCase();
  const limit = rateLimit(`register:${email}`, 5, 60_000);
  if (!limit.ok) return fail("Please wait a moment before trying again.");
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return fail("An account with that email already exists.");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: { email, name: parsed.data.name, passwordHash, role: "CUSTOMER" },
  });
  await signIn("credentials", { email, password: parsed.data.password, redirect: false });
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) await mergeCartsOnLogin(user.id);
  redirect("/account");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fail("Enter a valid email and password.");
  const limit = rateLimit(`login:${parsed.data.email}`, 8, 60_000);
  if (!limit.ok) return fail("Too many attempts. Try again shortly.");
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    return fail("Those details did not match an account.");
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) await mergeCartsOnLogin(user.id);
  const next = String(formData.get("next") ?? "/account");
  redirect(next.startsWith("/") ? next : "/account");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return fail("Enter a valid email.");
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (user) {
    const token = randomBytes(24).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 30),
      },
    });
    await sendEmail({
      to: user.email,
      subject: "Reset your Petals & Hearts password",
      text: `Reset link: ${getEnv().siteUrl}/reset-password?token=${token}`,
      html: `<p>Use this link within 30 minutes:</p><p>${getEnv().siteUrl}/reset-password?token=${token}</p>`,
    });
  }
  return { ok: true, message: "If that email exists, we sent reset instructions." };
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) return;
  const record = await prisma.passwordResetToken.findUnique({ where: { token: parsed.data.token } });
  if (!record || record.expires < new Date()) return;
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({ where: { email: record.email }, data: { passwordHash } });
  await prisma.passwordResetToken.delete({ where: { id: record.id } });
}

export async function checkoutAction(formData: FormData) {
  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
    purchaserName: formData.get("purchaserName"),
    isGift: formData.get("isGift") === "on",
    recipientName: formData.get("recipientName") || formData.get("purchaserName"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode") || undefined,
    zoneId: formData.get("zoneId"),
    deliveryDate: formData.get("deliveryDate"),
    deliveryWindow: formData.get("deliveryWindow"),
    deliveryInstructions: formData.get("deliveryInstructions") || undefined,
    giftMessage: formData.get("giftMessage") || undefined,
    substitutionPolicy: formData.get("substitutionPolicy") || "APPROVED_SUBSTITUTES",
    promoCode: formData.get("promoCode") || undefined,
  });
  if (!parsed.success) return;
  const user = await getSessionUser();
  const cart = await getCart();
  const { created, authorizationUrl } = await createPendingOrder(cart.id, parsed.data, user?.id);
  void created;
  redirect(authorizationUrl);
}

export async function completeMockPaymentAction(formData: FormData) {
  if (getEnv().paymentProvider !== "mock") {
    throw new Error("Mock payments are disabled.");
  }
  const reference = String(formData.get("reference") ?? "");
  const decision = String(formData.get("decision") ?? "SUCCEEDED") as "SUCCEEDED" | "FAILED";
  settleMockPayment(reference, decision);
  if (decision === "SUCCEEDED") {
    const payment = await prisma.payment.findUnique({ where: { providerReference: reference } });
    if (payment) await fulfillVerifiedPayment(reference, payment.amountPesewas);
    redirect(`/checkout/success?reference=${reference}`);
  }
  redirect(`/checkout?error=payment`);
}

export async function newsletterAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    consent: formData.get("consent") === "on" ? true : undefined,
  });
  if (!parsed.success) return fail("Enter your email and confirm consent.");
  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing?.unsubscribedAt == null && existing) {
    return fail("This email is already subscribed.");
  }
  await prisma.newsletterSubscription.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: { unsubscribedAt: null, consentedAt: new Date() },
    create: { email: parsed.data.email.toLowerCase() },
  });
  return { ok: true, message: "You are subscribed." };
}

export async function contactAction(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return;
  const limit = rateLimit(`contact:${parsed.data.email}`, 4, 60_000);
  if (!limit.ok) return;
  await prisma.contactMessage.create({ data: parsed.data });
}

export async function reviewAction(formData: FormData) {
  const user = await requireUser();
  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    displayName: formData.get("displayName"),
    rating: Number(formData.get("rating")),
    body: formData.get("body"),
  });
  if (!parsed.success) return;
  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId: parsed.data.productId,
      order: { userId: user.id, status: { in: ["PAID", "PROCESSING", "READY_FOR_DISPATCH", "OUT_FOR_DELIVERY", "DELIVERED"] } },
    },
  });
  await prisma.productReview.create({
    data: {
      ...parsed.data,
      userId: user.id,
      verified: Boolean(purchased),
      status: "PENDING",
    },
  });
}

export async function saveAddressAction(formData: FormData) {
  const user = await requireUser();
  const parsed = addressSchema.safeParse({
    label: formData.get("label"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || undefined,
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode") || undefined,
  });
  if (!parsed.success) return;
  await prisma.address.create({ data: { ...parsed.data, userId: user.id } });
  revalidatePath("/account/addresses");
}

export async function trackOrderAction(formData: FormData) {
  const reference = String(formData.get("reference") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const order = await getOrderByReference(reference, email);
  if (!order) return;
  redirect(`/track-order/${order.reference}?email=${encodeURIComponent(email)}`);
}

export async function adminUpdateOrderAction(formData: FormData) {
  await requireRole(["ADMIN", "STAFF"]);
  const id = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as never;
  const { updateOrderStatus } = await import("@/server/orders");
  await updateOrderStatus(id, status, String(formData.get("note") ?? "") || undefined);
  revalidatePath("/admin/orders");
}

export async function adminAdjustStockAction(formData: FormData) {
  await requireRole(["ADMIN", "STAFF"]);
  const productId = String(formData.get("productId") ?? "");
  const delta = Number(formData.get("delta") ?? 0);
  const note = String(formData.get("note") ?? "Manual adjustment");
  await prisma.$transaction([
    prisma.product.update({ where: { id: productId }, data: { stockQuantity: { increment: delta } } }),
    prisma.inventoryRecord.updateMany({ where: { productId }, data: { quantity: { increment: delta } } }),
    prisma.inventoryMovement.create({ data: { productId, delta, reason: "ADJUSTMENT", note } }),
  ]);
  revalidatePath("/admin/inventory");
}
