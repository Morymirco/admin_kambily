import Link from 'next/link';
import Image from 'next/image';

export default function TimerSection({ timeLeft }) {
  return (
    <div className="px-4 py-3 bg-white">
      <div className="w-full">
        <div className="bg-[#E8F8F9] rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-mono text-[#048B9A] text-sm font-medium tracking-wider">
              {timeLeft}
            </div>
            <p className="text-xs text-gray-500">
              Achetez maintenant et profitez de l'offre!
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 border-t pt-3">
        <div className="font-medium text-sm flex items-center gap-2">
            <Image src="/camion.png" alt="Quality" width={20} height={20} className="inline-block " />
            Livraison Gratuite</div>
        <Link href="#" className="text-xs text-[#048B9A] flex items-center gap-1">
          Voir Plus 
          <span className="text-xs">→</span>
        </Link>
      </div>
    </div>
  );
} 