import Image from 'next/image';

export default function CategorySection({ title, image, products }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
            {title}
          </h2>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="space-y-2">
              <div className="relative h-24 sm:h-32 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-[#048B9A]">
                {product.price} GNF
              </p>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-[#048B9A] border border-[#048B9A] rounded-md hover:bg-[#048B9A] hover:text-white transition-colors">
          Voir plus
        </button>
      </div>
    </div>
  );
} 