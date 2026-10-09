/**
 * Central brand and store configuration.
 *
 * Values marked PLACEHOLDER must be replaced with official business details
 * before a production launch. The working name is taken from the project
 * folder so the storefront has a coherent identity while those details are pending.
 */

export const brand = {
  name: "Petals & Hearts",
  legalName: "Petals & Hearts",
  tagline: "Flowers that say what words cannot.",
  description:
    "A boutique floral studio for thoughtful gifts, celebrations, and everyday beauty.",
  wordmark: "Petals & Hearts",
  logo: {
    src: "/brand/wordmark.svg",
    alt: "Petals & Hearts",
    width: 180,
    height: 36,
  },
  locale: "en-GH",
  currency: "GHS",
  currencySymbol: "GH₵",
  timeZone: "Africa/Accra",
  country: "GH",
  contact: {
    email: "hello@your-domain.com",
    phone: "+233 XX XXX XXXX",
    whatsapp: "",
    addressLine1: "Street address to be confirmed",
    addressLine2: "",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    isPlaceholder: true,
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    pinterest: "",
  },
  hours: [
    { day: "Monday–Friday", hours: "09:00–18:00" },
    { day: "Saturday", hours: "09:00–16:00" },
    { day: "Sunday", hours: "By scheduled delivery only" },
  ],
  delivery: {
    sameDayCutoffNote:
      "Same-day delivery is offered only in configured zones before the published cutoff, subject to remaining capacity.",
    substitutionPolicy:
      "If a stem or colour is unavailable, our designers may use an approved substitute of equal or greater value unless you ask us to contact you first.",
    leadTimeNote: "Most arranged orders require at least one business day.",
  },
  seo: {
    title: "Petals & Hearts — Premium floral gifts",
    description:
      "Shop thoughtfully arranged bouquets, roses, orchids, and plants. Schedule delivery and add a personal gift message.",
  },
  announcement:
    "Handwritten cards included with every gift order. Delivery availability is confirmed at checkout.",
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/bouquets", label: "Bouquets" },
  { href: "/shop/flower-arrangements", label: "Arrangements" },
  { href: "/shop/roses", label: "Roses" },
  { href: "/shop/plants", label: "Plants" },
  { href: "/shop/orchids", label: "Orchids" },
  { href: "/occasions", label: "Occasions" },
  { href: "/custom-bouquet", label: "Custom" },
] as const;

export const footerLinks = {
  shop: [
    { href: "/shop", label: "All flowers" },
    { href: "/collections", label: "Collections" },
    { href: "/occasions", label: "Occasions" },
    { href: "/custom-bouquet", label: "Custom bouquet" },
  ],
  help: [
    { href: "/delivery-information", label: "Delivery" },
    { href: "/returns-and-refunds", label: "Returns" },
    { href: "/faq", label: "FAQ" },
    { href: "/track-order", label: "Track an order" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/terms-and-conditions", label: "Terms" },
  ],
} as const;
