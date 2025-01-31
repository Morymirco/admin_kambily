import React from 'react';
import Image from 'next/image';
const Features = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Meilleure Qualité */}
        <div className="flex items-center gap-4">
          {/* <svg 
            className="w-14 h-14 text-[#048B9A] flex-shrink-0" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
            <path d="M16 16l-1.5-1.5" />
            <path d="M8 16l1.5-1.5" />
            <path d="M12 18v-2" />
          </svg> */}
          <Image src="/icons/bag.svg" alt="Quality" width={50} height={50} />
          <div>
            <h3 className="text-xl font-semibold mb-2">Meilleure Qualité</h3>
            <p className="text-gray-600">
              Nous offrons des produits de qualité supérieure pour une expérience d'achat en toute confiance.
            </p>
          </div>
        </div>

        {/* Meilleures Offres */}
        <div className="flex items-center gap-4">
          <Image src="/icons/price.png" alt="Quality" width={100} height={100} />
          <div>
            <h3 className="text-xl font-semibold mb-2">Meilleures Offres</h3>
            <p className="text-gray-600">
              Découvrez nos offres imbattables conçues pour offrir le meilleur rapport qualité-prix.
            </p>
          </div>
        </div>

        {/* Paiement Sécurisé */}
        <div className="flex items-center gap-4">
          <Image src="/icons/paiement.png" alt="Quality" width={100} height={100} />
         
          <div>
            <h3 className="text-xl font-semibold mb-2">Paiement Sécurisé</h3>
            <p className="text-gray-600">
              Nous nous engageons à vous offrir une expérience d'achat en ligne sûre et fiable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;
