'use client'
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import CountdownPromo from './PromoTemplates/CountdownPromo';
import NewsletterPromo from './PromoTemplates/NewsletterPromo';
import SimplePromo from './PromoTemplates/SimplePromo';

export default function PromoManager() {
  const [currentPromo, setCurrentPromo] = useState(null);

  useEffect(() => {
    // Ici, vous pourriez faire un appel API pour récupérer la promo active
    const fetchActivePromo = async () => {
      try {
        const response = await fetch('https://api.kambily.store/active-promo');
        const data = await response.json();
        if (data.active) {
          setCurrentPromo(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la promo:', error);
      }
    };

    fetchActivePromo();
  }, []);

  const handleClose = () => {
    setCurrentPromo(null);
    localStorage.setItem('lastPromoShown', new Date().toISOString());
  };

  if (!currentPromo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/50">
        {currentPromo.type === 'simple' && (
          <SimplePromo {...currentPromo} onClose={handleClose} />
        )}
        {currentPromo.type === 'newsletter' && (
          <NewsletterPromo {...currentPromo} onClose={handleClose} />
        )}
        {currentPromo.type === 'countdown' && (
          <CountdownPromo {...currentPromo} onClose={handleClose} />
        )}
      </div>
    </AnimatePresence>
  );
} 