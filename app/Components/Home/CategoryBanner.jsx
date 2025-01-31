import Image from 'next/image';

export default function CategoryBanner({ 
  imageUrl,
  imageAlt,
  category,
  title,
  description,
  buttonText = "Explorer →",
  onClick
}) {
  return (
    <div className="m-4 relative rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={400}
        height={300}
        className="w-full h-[200px] object-cover"
      />
      <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-between">
        <div>
          <div className="inline-block bg-[#048B9A] text-white text-xs px-2 py-1 rounded">
            {category}
          </div>
          <h2 className="text-white text-xl font-bold mt-2">
            {title}
          </h2>
          <p className="text-white/90 text-sm mt-1">
            {description}
          </p>
        </div>
        <button 
          onClick={onClick}
          className="text-white text-sm font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
} 