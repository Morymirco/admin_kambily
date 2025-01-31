import Image from 'next/image';
import TimerSection from './TimerSection';

export default function QualityHeader({ timeLeft }) {
  return (
    <div className="w-full">
      {/* Quality Header */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="text-[#048B9A] flex-shrink-0">
            <Image 
              src="/icons/bag.svg" 
              alt="Quality" 
              width={34} 
              height={34}
              className="w-6 h-6"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium">Meilleure Qualité</h2>
            <p className="text-xs text-gray-400 leading-tight ">
              Nous offrons des produits de qualité supérieure pour une expérience d'achat en toute confiance.
            </p>
          </div>
        </div>
      </div>

      {/* Timer Section */}
      <TimerSection timeLeft={timeLeft} />
    </div>
  );
} 