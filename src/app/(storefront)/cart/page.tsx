import Image from "next/image";
import { quoteCart } from "@/server/cart";
import { applyPromoAction, removeCartItemAction, updateCartItemAction } from "@/server/actions";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Bag" };

export default async function CartPage() {
  const { cart, quote, promotion } = await quoteCart();
  if (cart.items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-muted">When you find an arrangement, it will appear here.</p>
        <div className="mt-6">
          <Button href="/shop">Continue shopping</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <h1 className="font-serif text-4xl">Your bag</h1>
        <ul className="mt-6 space-y-4">
          {cart.items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-3xl border border-line bg-white p-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-lavender-pale">
                {item.product.images[0] && (
                  <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" sizes="96px" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted">{formatMoney(item.variant?.pricePesewas ?? item.product.pricePesewas)}</p>
                {item.personalization ? <p className="text-xs text-brand">Custom configuration saved</p> : null}
                <div className="mt-3 flex gap-2">
                  <form action={updateCartItemAction} className="flex items-center gap-2">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input name="quantity" type="number" min={0} defaultValue={item.quantity} className="w-16 rounded-xl border border-line px-2 py-1" />
                    <button className="text-sm underline">Update</button>
                  </form>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button className="text-sm text-danger">Remove</button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit rounded-3xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(quote.subtotalPesewas)}</dd></div>
          <div className="flex justify-between"><dt>Promotion</dt><dd>−{formatMoney(quote.discountPesewas)}</dd></div>
          <div className="flex justify-between text-muted"><dt>Delivery</dt><dd>Calculated at checkout</dd></div>
          <div className="flex justify-between font-semibold"><dt>Estimated total</dt><dd>{formatMoney(quote.subtotalPesewas - quote.discountPesewas)}</dd></div>
        </dl>
        <form action={applyPromoAction} className="mt-4 flex gap-2">
          <input name="code" placeholder="Promo code" className="flex-1 rounded-full border border-line px-3 py-2 text-sm" />
          <button className="rounded-full bg-lavender px-4 text-sm">Apply</button>
        </form>
        {promotion && <p className="mt-2 text-xs text-success">Code {promotion.code} is applied{promotion.isDemo ? " (demo)" : ""}.</p>}
        <div className="mt-6">
          <Button href="/checkout" className="w-full">Checkout</Button>
        </div>
      </aside>
    </div>
  );
}
