import Image from "next/image";
import Link from "next/link";
import { listOccasions } from "@/server/catalog";

export const metadata = { title: "Occasions" };

export default async function OccasionsPage() {
  const occasions = await listOccasions();
  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-5xl">Occasions</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {occasions.map((occasion) => (
          <Link key={occasion.id} href={`/occasions/${occasion.slug}`} className="overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              {occasion.imageUrl && <Image src={occasion.imageUrl} alt={occasion.name} fill className="object-cover" sizes="33vw" />}
              <p className="absolute bottom-4 left-4 font-serif text-3xl text-white">{occasion.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
