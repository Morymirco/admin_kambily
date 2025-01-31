'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export default function SimplePromo({ 
  image, 
  title, 
  description, 
  discount, 
  buttonText = "Découvrir maintenant",
  onClose,
  onAction
}) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="relative bg-white rounded-xl shadow-xl w-[calc(100%-16px)] sm:w-[95%] max-w-md overflow-hidden mx-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white"
      >
        <FaTimes className="w-4 h-4 text-gray-600" />
      </button>

      <div className="relative h-48 sm:h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        {discount && (
          <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold mb-6">
            {discount}
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="w-full bg-[#048B9A] text-white py-3 rounded-lg hover:bg-[#037483]"
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
} 