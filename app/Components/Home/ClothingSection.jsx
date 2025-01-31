import Image from 'next/image';
import Link from 'next/link';

export default function ClothingSection() {
  return (
    <section className="p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Nos Vêtements</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/categories/robes" className="relative aspect-square">
          <Image
            src="/categories/robes.jpg"
            alt="Robes"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded">
            <span className="text-sm font-medium">Robes</span>
          </div>
        </Link>
        <Link href="/categories/tops" className="relative aspect-square">
          <Image
            src="/categories/tops.jpg"
            alt="Tops"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded">
            <span className="text-sm font-medium">Tops</span>
          </div>
        </Link>
      </div>
    </section>
  );
} 