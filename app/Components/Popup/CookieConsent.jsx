'use client'
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCookieBite, FaTimes } from 'react-icons/fa';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowConsent(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  const cookieTypes = [
    {
      name: 'Nécessaires',
      description: 'Ces cookies sont essentiels au fonctionnement du site.',
      required: true
    },
    {
      name: 'Préférences',
      description: 'Ces cookies permettent de mémoriser vos préférences de navigation.',
      required: false
    },
    {
      name: 'Statistiques',
      description: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site.',
      required: false
    },
    {
      name: 'Marketing',
      description: 'Ces cookies sont utilisés pour suivre les visiteurs sur les sites Web.',
      required: false
    }
  ];

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-[4.5rem] sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 z-[1001] w-auto sm:w-[95%] sm:max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 mx-2 sm:mx-0"
        >
          <div className="p-3 sm:p-5">
            <div className="flex gap-2 sm:gap-4">
              {/* Icône */}
              <div className="text-[#048B9A] mt-1 hidden sm:block">
                <FaCookieBite size={20} />
              </div>

              {/* Contenu */}
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-start gap-2 sm:gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                      Nous respectons votre vie privée
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Pour offrir les meilleures expériences, nous utilisons des cookies pour personnaliser le contenu et les publicités.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowConsent(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Détails des cookies */}
                <div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs sm:text-sm text-[#048B9A] hover:underline flex items-center gap-1"
                  >
                    {showDetails ? '− Masquer les détails' : '+ Voir les détails'}
                  </button>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2 sm:mt-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                          {cookieTypes.map((cookie, index) => (
                            <div 
                              key={index}
                              className="p-2 sm:p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium">{cookie.name}</h3>
                                {cookie.required && (
                                  <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                                    Requis
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] sm:text-xs text-gray-600">
                                {cookie.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <motion.button
                    onClick={handleAcceptAll}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 bg-[#048B9A] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#037483] transition-colors"
                  >
                    Accepter tout
                  </motion.button>
                  <motion.button
                    onClick={handleAcceptNecessary}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 border border-[#048B9A] text-[#048B9A] text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Nécessaire uniquement
                  </motion.button>
                  <motion.button
                    onClick={handleDecline}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 border border-gray-200 text-gray-600 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Refuser
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent; 