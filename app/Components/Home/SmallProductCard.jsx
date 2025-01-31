import Image from 'next/image';

export default function SmallProductCard({ 
  imageUrl, 
  title, 
  price, 
  originalPrice,
  imageSize = 20 
}) {
  return (
    <div className="flex gap-3 bg-white p-2 rounded-lg border border-gray-100 hover:border-gray-200">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain p-1 rounded-xl"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-700 line-clamp-2">
          {title}
        </h3>
        <div className="mt-1">
          {originalPrice && (
            <div className="text-xs text-gray-400 line-through">
              {originalPrice.toLocaleString()}GNF
            </div>
          )}
          <div className="text-[#048B9A] font-medium">
            {price.toLocaleString()}GNF
          </div>
        </div>
      </div>
    </div>
  );
} 