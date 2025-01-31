'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaClock, FaTimes } from 'react-icons/fa';

export default function CountdownPromo({
  image,
  title,
  description,
  endDate,
  onClose,
  onAction
}) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        onClose();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onClose]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="relative bg-white rounded-xl shadow-xl w-[calc(100%-16px)] sm:w-[95%] max-w-md overflow-hidden"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80"
      >
        <FaTimes className="w-4 h-4 text-gray-600" />
      </button>

      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center gap-3">
          <FaClock className="text-[#048B9A]" />
          <div className="font-mono text-lg font-medium">{timeLeft}</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="w-full bg-[#048B9A] text-white py-3 rounded-lg hover:bg-[#037483]"
        >
          En profiter maintenant
        </motion.button>
      </div>
    </motion.div>
  );
} 