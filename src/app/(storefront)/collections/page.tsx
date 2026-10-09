import Image from "next/image";
import Link from "next/link";
import { listCollections } from "@/server/catalog";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await listCollections();
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-5xl">Collections</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.slug}`} className="overflow-hidden rounded-3xl border border-line bg-white">
            <div className="relative aspect-[16/9] bg-lavender-pale">
              {collection.imageUrl && <Image src={collection.imageUrl} alt={collection.name} fill className="object-cover" sizes="50vw" />}
            </div>
            <div className="p-6">
              <h2 className="font-serif text-3xl">{collection.name}</h2>
              <p className="mt-2 text-sm text-muted">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
