import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { calculateQuote } from "@/lib/pricing";
import { getSessionUser } from "@/lib/auth/session";

const CART_COOKIE = "ph_cart";
const cartInclude = {
  items: {
    include: {
      product: { include: { images: { orderBy: { sortOrder: "asc" as const } } } },
      variant: true,
    },
    orderBy: { createdAt: "asc" as const },
  },
};

function persistCartCookie(
  jar: Awaited<ReturnType<typeof cookies>>,
  id: string,
) {
  jar.set(CART_COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function readCartId() {
  const jar = await cookies();
  const existing = jar.get(CART_COOKIE)?.value;
  if (!existing) return null;
  const found = await prisma.cart.findUnique({ where: { id: existing } });
  return found?.id ?? null;
}

export async function getCartId() {
  const existing = await readCartId();
  if (existing) return existing;
  const user = await getSessionUser();
  if (user?.id) {
    const owned = await prisma.cart.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    if (owned) {
      persistCartCookie(await cookies(), owned.id);
      return owned.id;
    }
  }
  const created = await prisma.cart.create({
    data: { userId: user?.id ?? null },
  });
  persistCartCookie(await cookies(), created.id);
  return created.id;
}

export async function getCart() {
  const id = await readCartId();
  if (!id) {
    return {
      id: "",
      userId: null,
      promoCode: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      items: [],
    };
  }
  return prisma.cart.findUniqueOrThrow({
    where: { id },
    include: cartInclude,
  });
}

export async function quoteCart(deliveryPesewas = 0) {
  const cart = await getCart();
  const promotion = cart.promoCode
    ? await prisma.promotion.findUnique({ where: { code: cart.promoCode.toUpperCase() } })
    : null;
  const now = new Date();
  const validPromo =
    promotion && promotion.isActive && promotion.startsAt <= now && promotion.endsAt >= now
      ? promotion
      : null;
  const quote = calculateQuote({
    lines: cart.items.map((item) => ({
      unitPesewas: item.variant?.pricePesewas ?? item.product.pricePesewas,
      quantity: item.quantity,
    })),
    promotion: validPromo,
    deliveryPesewas,
  });
  return { cart, quote, promotion: validPromo };
}

export async function cartCount() {
  try {
    const id = await readCartId();
    if (!id) return 0;
    const aggregate = await prisma.cartItem.aggregate({
      where: { cartId: id },
      _sum: { quantity: true },
    });
    return aggregate._sum.quantity ?? 0;
  } catch {
    return 0;
  }
}

export async function mergeCartsOnLogin(userId: string) {
  const jar = await cookies();
  const guestId = jar.get(CART_COOKIE)?.value;
  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });
  if (!guestId || guestId === userCart?.id) return;
  const guest = await prisma.cart.findUnique({
    where: { id: guestId },
    include: { items: true },
  });
  if (!guest) return;
  const target = userCart ?? (await prisma.cart.create({ data: { userId } }));
  for (const item of guest.items) {
    const match =
      target.id === guest.id
        ? null
        : await prisma.cartItem.findFirst({
            where: { cartId: target.id, productId: item.productId, variantId: item.variantId },
          });
    if (match) {
      await prisma.cartItem.update({
        where: { id: match.id },
        data: { quantity: match.quantity + item.quantity },
      });
    } else if (target.id !== guest.id) {
      await prisma.cartItem.create({
        data: {
          cartId: target.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          giftMessage: item.giftMessage,
          recipientName: item.recipientName,
          personalization: item.personalization ?? undefined,
        },
      });
    }
  }
  if (target.id !== guest.id) {
    await prisma.cart.delete({ where: { id: guest.id } }).catch(() => undefined);
  }
  persistCartCookie(jar, target.id);
}
