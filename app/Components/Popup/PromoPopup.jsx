'use client'
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Vérifier si le popup a déjà été fermé aujourd'hui
    const lastClosed = localStorage.getItem('promoPopupClosed');
    const today = new Date().toDateString();

    if (true) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // Afficher après 3 secondes

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Sauvegarder la date de fermeture
    localStorage.setItem('promoPopupClosed', new Date().toDateString());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1001] flex items-center justify-center p-2 sm:p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-xl shadow-xl w-[calc(100%-16px)] sm:w-[95%] max-w-md overflow-hidden mx-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            </button>

            {/* Image promo */}
            <div className="relative h-48 sm:h-64 w-full">
              <Image
                src="/souris.webp"
                alt="Nouvelle collection"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Contenu */}
            <div className="p-4 sm:p-6 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Nouvelle Collection !
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Découvrez notre nouvelle collection avec des réductions allant jusqu'à 30%
                </p>

                {/* Badge promo */}
                <div className="inline-block bg-red-100 text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-semibold mb-4 sm:mb-6">
                  -30% sur tout
                </div>

                {/* Boutons */}
                <div className="space-y-2 sm:space-y-3">
                  <Link href="/boutique">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#048B9A] text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base hover:bg-[#037483] transition-colors"
                    >
                      Découvrir maintenant
                    </motion.button>
                  </Link>
                  
                  <button
                    onClick={handleClose}
                    className="w-full text-gray-500 text-sm sm:text-base hover:text-gray-700 transition-colors"
                  >
                    Peut-être plus tard
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup; 