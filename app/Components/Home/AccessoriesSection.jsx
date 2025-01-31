import Image from 'next/image';
import Link from 'next/link';

export default function AccessoriesSection() {
  return (
    <section className="p-4 mt-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Accessoires Tendance</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/categories/sacs" className="relative aspect-square">
          <Image
            src="/categories/sacs.jpg"
            alt="Sacs"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded">
            <span className="text-sm font-medium">Sacs</span>
          </div>
        </Link>
        <Link href="/categories/chaussures" className="relative aspect-square">
          <Image
            src="/categories/chaussures.jpg"
            alt="Chaussures"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded">
            <span className="text-sm font-medium">Chaussures</span>
          </div>
        </Link>
      </div>
    </section>
  );
} 