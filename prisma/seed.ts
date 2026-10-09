import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function unsplash(photo: string, w = 1400) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${w}&q=80`;
}

async function main() {
  await prisma.orderEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderAddress.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.promotionRedemption.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.productOccasion.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.inventoryRecord.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.occasion.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.storeSettings.deleteMany();
  await prisma.newsletterSubscription.deleteMany();
  await prisma.passwordResetToken.deleteMany();

  const adminHash = await bcrypt.hash(process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "ChangeMeNow!Admin", 12);
  const customerHash = await bcrypt.hash("Customer123!", 12);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_BOOTSTRAP_EMAIL ?? "admin@localhost" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: process.env.ADMIN_BOOTSTRAP_EMAIL ?? "admin@localhost",
      name: "Studio Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@localhost" },
    update: {},
    create: {
      email: "customer@localhost",
      name: "Demo Customer",
      passwordHash: customerHash,
      role: "CUSTOMER",
    },
  });

  const categories = await Promise.all(
    [
      { name: "Roses", slug: "roses", imageUrl: unsplash("photo-1518895949257-7621c3c786d7"), sortOrder: 1, description: "Classic and garden roses, boxed or wrapped." },
      { name: "Bouquets", slug: "bouquets", imageUrl: unsplash("photo-1561181286-d3fee7d55364"), sortOrder: 2, description: "Hand-tied seasonal bouquets." },
      { name: "Flower arrangements", slug: "flower-arrangements", imageUrl: unsplash("photo-1487530813396-ad8185297d52"), sortOrder: 3, description: "Vase and hat-box arrangements." },
      { name: "Orchids", slug: "orchids", imageUrl: unsplash("photo-1617575527765-1d79962945c5"), sortOrder: 4, description: "Potted and cut orchid designs." },
      { name: "Plants", slug: "plants", imageUrl: unsplash("photo-1459411552884-841db9b3cc2a"), sortOrder: 5, description: "Indoor plants for lasting gifts." },
      { name: "Gifts", slug: "gifts", imageUrl: unsplash("photo-1513885535751-8b9238bd345a"), sortOrder: 6, description: "Add-on hampers, candles, and cards." },
    ].map((item) => prisma.category.create({ data: item })),
  );

  const cat = Object.fromEntries(categories.map((item) => [item.slug, item]));

  const collections = await Promise.all(
    [
      { name: "Signature Studio", slug: "signature-studio", isFeatured: true, imageUrl: unsplash("photo-1490750967990-4d38be6c287e"), description: "House arrangements designed for gifting." },
      { name: "Quiet Luxury", slug: "quiet-luxury", isFeatured: true, imageUrl: unsplash("photo-1455659817273-f968072db551"), description: "Restrained palettes and premium stems." },
    ].map((item) => prisma.collection.create({ data: item })),
  );

  const occasions = await Promise.all(
    [
      { name: "Birthdays", slug: "birthdays", imageUrl: unsplash("photo-1530103862676-de8c9debad1d"), sortOrder: 1 },
      { name: "Anniversaries", slug: "anniversaries", imageUrl: unsplash("photo-1518199266791-5375a83190b7"), sortOrder: 2 },
      { name: "Weddings", slug: "weddings", imageUrl: unsplash("photo-1519225421980-715cb0215aed"), sortOrder: 3 },
      { name: "Romance", slug: "romance", imageUrl: unsplash("photo-1518895949257-7621c3c786d7"), sortOrder: 4 },
      { name: "Congratulations", slug: "congratulations", imageUrl: unsplash("photo-1468327768560-75b778cbb551"), sortOrder: 5 },
      { name: "Sympathy", slug: "sympathy", imageUrl: unsplash("photo-1487530813396-ad8185297d52"), sortOrder: 6 },
      { name: "Thank you", slug: "thank-you", imageUrl: unsplash("photo-1490750967990-4d38be6c287e"), sortOrder: 7 },
    ].map((item) => prisma.occasion.create({ data: { ...item, description: `Flowers chosen for ${item.name.toLowerCase()}.` } })),
  );

  const products = [
    {
      name: "Blush Tulip Sheaf",
      slug: "blush-tulip-sheaf",
      category: "bouquets",
      price: 28000,
      compare: 32000,
      stock: 12,
      featured: true,
      bestseller: true,
      flowers: ["tulip"],
      colors: ["blush", "ivory"],
      occasions: ["romance", "thank-you"],
      image: unsplash("photo-1526047932273-341f2a7631f9"),
      short: "A generous sheaf of blush tulips, loosely wrapped.",
      description: "Seasonal tulips arranged with quiet movement. A demo catalogue piece for local development.",
    },
    {
      name: "Velvet Rose Hatbox",
      slug: "velvet-rose-hatbox",
      category: "roses",
      price: 45000,
      stock: 8,
      featured: true,
      bestseller: true,
      flowers: ["rose"],
      colors: ["crimson"],
      occasions: ["romance", "anniversaries"],
      image: unsplash("photo-1518621012422-4d56e6c76d56"),
      short: "Deep red garden roses presented in a hatbox.",
      description: "A compact luxury rose arrangement. Demo product — replace photography with studio shots before launch.",
    },
    {
      name: "Ivory Cloud Bouquet",
      slug: "ivory-cloud-bouquet",
      category: "bouquets",
      price: 36000,
      stock: 10,
      featured: true,
      flowers: ["rose", "peony"],
      colors: ["ivory"],
      occasions: ["weddings", "thank-you"],
      image: unsplash("photo-1487530813396-ad8185297d52"),
      short: "Ivory blooms with soft foliage.",
      description: "An airy hand-tied bouquet for pale palettes. Demo catalogue item.",
    },
    {
      name: "Studio White Arrangement",
      slug: "studio-white-arrangement",
      category: "flower-arrangements",
      price: 42000,
      stock: 6,
      featured: true,
      flowers: ["rose", "lily"],
      colors: ["ivory"],
      occasions: ["sympathy", "weddings"],
      image: unsplash("photo-1561181286-d3fee7d55364"),
      short: "A composed white vase arrangement.",
      description: "Structured whites for formal gifting. Demo catalogue item.",
    },
    {
      name: "Garden Mix Basket",
      slug: "garden-mix-basket",
      category: "flower-arrangements",
      price: 39000,
      stock: 7,
      flowers: ["rose", "tulip", "lily"],
      colors: ["mixed"],
      occasions: ["birthdays", "congratulations"],
      image: unsplash("photo-1490750967990-4d38be6c287e"),
      short: "A gathered garden basket with mixed stems.",
      description: "Colour-forward and informal. Demo catalogue item.",
    },
    {
      name: "Rainbow Tulip Wrap",
      slug: "rainbow-tulip-wrap",
      category: "bouquets",
      price: 30000,
      stock: 14,
      bestseller: true,
      flowers: ["tulip"],
      colors: ["mixed"],
      occasions: ["birthdays", "congratulations"],
      image: unsplash("photo-1468327768560-75b778cbb551"),
      short: "Bright tulips wrapped for celebration.",
      description: "A cheerful seasonal wrap. Demo catalogue item.",
    },
    {
      name: "Crimson Rose Dome",
      slug: "crimson-rose-dome",
      category: "roses",
      price: 52000,
      stock: 5,
      featured: true,
      flowers: ["rose"],
      colors: ["crimson"],
      occasions: ["romance", "anniversaries"],
      image: unsplash("photo-1455659817273-f968072db551"),
      short: "A dense dome of crimson roses.",
      description: "Classic romantic presentation. Demo catalogue item.",
    },
    {
      name: "Phalaenopsis Orchid",
      slug: "phalaenopsis-orchid",
      category: "orchids",
      price: 34000,
      stock: 9,
      flowers: ["orchid"],
      colors: ["ivory", "lavender"],
      occasions: ["thank-you", "congratulations"],
      image: unsplash("photo-1617575527765-1d79962945c5"),
      short: "A potted moth orchid in a ceramic vessel.",
      description: "A lasting indoor orchid. Demo catalogue item.",
    },
    {
      name: "Lavender Orchid Spray",
      slug: "lavender-orchid-spray",
      category: "orchids",
      price: 38000,
      stock: 4,
      flowers: ["orchid"],
      colors: ["lavender"],
      occasions: ["romance", "thank-you"],
      image: unsplash("photo-1566873535350-a3f5d4a804ae"),
      short: "Cut orchid stems in a tall vase.",
      description: "Sculptural and quiet. Demo catalogue item.",
    },
    {
      name: "Olive Desk Plant",
      slug: "olive-desk-plant",
      category: "plants",
      price: 22000,
      stock: 11,
      flowers: [],
      colors: ["sage"],
      occasions: ["congratulations", "thank-you"],
      image: unsplash("photo-1459411552884-841db9b3cc2a"),
      short: "A compact indoor plant for the desk or foyer.",
      description: "Low-maintenance greenery. Demo catalogue item.",
    },
    {
      name: "Ceremony White Cascade",
      slug: "ceremony-white-cascade",
      category: "flower-arrangements",
      price: 68000,
      stock: 3,
      flowers: ["rose", "orchid"],
      colors: ["ivory"],
      occasions: ["weddings"],
      image: unsplash("photo-1519225421980-715cb0215aed"),
      short: "A ceremonial-scale white arrangement.",
      description: "Made to order for events. Demo catalogue item.",
      availability: "MADE_TO_ORDER" as const,
    },
    {
      name: "Atelier Custom Bouquet",
      slug: "atelier-custom-bouquet",
      category: "bouquets",
      price: 32000,
      stock: 99,
      flowers: ["rose", "tulip", "peony"],
      colors: ["blush", "ivory", "lavender", "crimson"],
      occasions: ["romance", "birthdays", "thank-you"],
      image: unsplash("photo-1508610048659-a06b669e3321"),
      short: "Build a bouquet with the atelier — size, stems, and wrap.",
      description: "Price is calculated from the options you choose in the custom-bouquet studio. Demo product used to persist configurations.",
      availability: "MADE_TO_ORDER" as const,
    },
  ];

  for (const item of products) {
    const created = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.short,
        description: item.description,
        categoryId: cat[item.category].id,
        pricePesewas: item.price,
        compareAtPesewas: "compare" in item ? item.compare : null,
        stockQuantity: item.stock,
        availability: "availability" in item ? item.availability : item.stock <= 4 ? "LOW_STOCK" : "AVAILABLE",
        isFeatured: Boolean(item.featured),
        isBestseller: Boolean(item.bestseller),
        isDemo: true,
        flowerVarieties: item.flowers,
        colors: item.colors,
        tags: [...item.flowers, ...item.colors, item.category],
        careInstructions: "Keep in cool water, recut stems, and avoid direct sun. Arranged flowers are perishable.",
        dimensions: "Presentation varies by vessel. Exact size is confirmed on the product card.",
        deliveryNotes: "Delivered according to the selected zone and date at checkout.",
        images: {
          create: [
            { url: item.image, alt: item.name, sortOrder: 0 },
            { url: unsplash("photo-1490750967990-4d38be6c287e"), alt: `${item.name} detail`, sortOrder: 1 },
          ],
        },
        variants: {
          create: [
            { name: "Standard", sku: `${item.slug}-std`, stockQuantity: item.stock, isDefault: true, pricePesewas: item.price },
          ],
        },
        inventory: { create: { quantity: item.stock, reserved: 0, lowStockAt: 3 } },
        movements: { create: { delta: item.stock, reason: "SEED", note: "Demo catalogue" } },
        collections: { create: { collectionId: collections[0].id } },
        occasions: {
          create: item.occasions
            .map((slug) => occasions.find((occ) => occ.slug === slug))
            .filter(Boolean)
            .map((occ) => ({ occasionId: occ!.id })),
        },
      },
    });
    void created;
  }

  await prisma.deliveryZone.createMany({
    data: [
      { name: "Accra Central", slug: "accra-central", feePesewas: 4000, cities: ["Accra", "Osu", "Labone", "Airport"], cutoffHour: 13, leadDays: 0, sameDay: true, dailyCapacity: 16 },
      { name: "Greater Accra", slug: "greater-accra", feePesewas: 7000, cities: ["Tema", "East Legon", "Spintex", "Cantonments"], cutoffHour: 11, leadDays: 1, sameDay: false, dailyCapacity: 20 },
      { name: "Outside Greater Accra", slug: "beyond-accra", feePesewas: 14000, cities: ["Other"], cutoffHour: 10, leadDays: 2, sameDay: false, dailyCapacity: 8 },
    ],
  });

  const now = new Date();
  const inSixMonths = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 180);
  await prisma.promotion.create({
    data: {
      code: "DEMO10",
      type: "PERCENT",
      percentOff: 10,
      minSubtotal: 20000,
      startsAt: now,
      endsAt: inSixMonths,
      usageLimit: 200,
      isDemo: true,
    },
  });

  await prisma.storeSettings.create({
    data: {
      id: "default",
      data: {
        announcement: "Handwritten cards included with every gift order. Delivery dates are confirmed at checkout.",
        hero: {
          eyebrow: "Seasonal atelier",
          title: "Flowers that say what words cannot.",
          subtitle: "Thoughtfully arranged blooms for the moments that matter most.",
          ctaLabel: "Shop bouquets",
          ctaHref: "/shop/bouquets",
          secondaryLabel: "Explore collections",
          secondaryHref: "/collections",
          image: unsplash("photo-1526047932273-341f2a7631f9", 2000),
        },
        story:
          "Petals & Hearts is a configurable boutique storefront. Replace this copy with the studio’s real story, sourcing, and service promises. No awards or years in business are claimed here.",
      },
    },
  });

  console.log("Seeded demo catalogue, zones, and users.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
