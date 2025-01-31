'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Carousel({ images, currentSlide, setCurrentSlide }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-2xl"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Indicateurs de navigation avec coins arrondis */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 p-2 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      {/* Boutons précédent/suivant avec coins arrondis */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={() => setCurrentSlide(prev => (prev === 0 ? images.length - 1 : prev - 1))}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Image précédente"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev === images.length - 1 ? 0 : prev + 1))}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Image suivante"
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
} 