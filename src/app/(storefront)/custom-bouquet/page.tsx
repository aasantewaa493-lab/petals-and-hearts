import { bouquetBuilder } from "@/config/bouquet";
import { addCustomBouquetAction } from "@/server/actions";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Custom bouquet" };

export default function CustomBouquetPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <p className="text-sm text-brand">Atelier</p>
      <h1 className="font-serif text-5xl">Compose a bouquet</h1>
      <p className="mt-3 text-muted">
        Price is calculated from the options below. The visual is representative — it is not a generated preview of the exact finished arrangement.
      </p>
      <form action={addCustomBouquetAction} className="mt-8 space-y-6 rounded-3xl border border-line bg-white p-6">
        <fieldset>
          <legend className="font-semibold">1. Size</legend>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {bouquetBuilder.sizes.map((size, index) => (
              <label key={size.id} className="rounded-2xl border border-line p-3 text-sm">
                <input type="radio" name="size" value={size.id} defaultChecked={index === 0} className="mr-2" />
                {size.name} · {size.stems} · {formatMoney(size.pricePesewas)}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-semibold">2. Flower varieties</legend>
          <div className="mt-3 grid gap-2">
            {bouquetBuilder.flowers.map((flower) => (
              <label key={flower.id} className="text-sm">
                <input type="checkbox" name="flowers" value={flower.id} className="mr-2" defaultChecked={flower.id === "rose"} />
                {flower.name}
                {flower.pricePesewas > 0 ? ` + ${formatMoney(flower.pricePesewas)}` : ""}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-semibold">
          3. Palette
          <select name="palette" className="mt-2 w-full rounded-2xl border border-line px-3 py-2 font-normal">
            {bouquetBuilder.palettes.map((palette) => (
              <option key={palette.id} value={palette.id}>
                {palette.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <input type="checkbox" name="greenery" className="mr-2" />
          Add greenery (+{formatMoney(bouquetBuilder.greeneryPesewas)})
        </label>
        <label className="block text-sm font-semibold">
          4. Wrap
          <select name="wrap" className="mt-2 w-full rounded-2xl border border-line px-3 py-2 font-normal">
            {bouquetBuilder.wraps.map((wrap) => (
              <option key={wrap.id} value={wrap.id}>
                {wrap.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <input type="checkbox" name="card" className="mr-2" />
          Greeting card (+{formatMoney(bouquetBuilder.cardPesewas)})
        </label>
        <input name="recipientName" placeholder="Recipient name" className="w-full rounded-2xl border border-line px-3 py-2" />
        <textarea name="message" placeholder="Card message" className="w-full rounded-2xl border border-line px-3 py-2" />
        <button className="w-full rounded-full bg-brand py-3 font-semibold text-white">Add configured bouquet</button>
      </form>
    </div>
  );
}
