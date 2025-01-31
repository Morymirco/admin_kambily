'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Afficher le bouton quand on scroll plus bas que 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 bg-[#E9EAEA] hover:bg-[#048B9A] text-[#048B9A] hover:text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-[9998]"
          aria-label="Remonter en haut"
        >
          <div className="relative w-4 h-4 sm:w-5 sm:h-5">
            <Image 
              src="/arrow.svg"
              alt="Remonter"
              fill
              className="object-contain transition-transform rotate-180"
            />
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 