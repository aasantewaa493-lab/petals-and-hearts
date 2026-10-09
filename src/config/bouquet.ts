export const bouquetBuilder = {
  sizes: [
    { id: "classic", name: "Classic", stems: "12–16 stems", pricePesewas: 32000 },
    { id: "luxe", name: "Luxe", stems: "20–24 stems", pricePesewas: 48000 },
    { id: "grand", name: "Grand", stems: "32–40 stems", pricePesewas: 72000 },
  ],
  flowers: [
    { id: "rose", name: "Garden roses", pricePesewas: 0 },
    { id: "tulip", name: "Tulips", pricePesewas: 4000 },
    { id: "peony", name: "Peonies (seasonal)", pricePesewas: 8000 },
    { id: "orchid", name: "Orchid accents", pricePesewas: 6000 },
    { id: "lily", name: "Lilies", pricePesewas: 3500 },
  ],
  palettes: [
    { id: "blush", name: "Blush & cream" },
    { id: "ivory", name: "Ivory & sage" },
    { id: "lavender", name: "Lavender dusk" },
    { id: "crimson", name: "Deep crimson" },
  ],
  wraps: [
    { id: "silk", name: "Silk ribbon", pricePesewas: 0 },
    { id: "linen", name: "Linen wrap", pricePesewas: 2500 },
    { id: "kraft", name: "Kraft & twine", pricePesewas: 0 },
  ],
  greeneryPesewas: 2000,
  cardPesewas: 1500,
} as const;

export type BouquetSelection = {
  size: string;
  flowers: string[];
  palette: string;
  greenery: boolean;
  wrap: string;
  card: boolean;
  message: string;
  recipientName: string;
};
