'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-8 rounded-2xl relative"
      >
        <div className="relative w-24 h-24">
          {/* Cercle rotatif */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-[#048B9A]/20 border-t-[#048B9A] rounded-full"
          />
          
          {/* Logo au centre */}
          <div className="absolute inset-0 m-auto w-10 h-10">
            <Image
              src="/logospinner.svg"
              alt="Logo"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>
        </div>
        
        {/* Texte animé */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-2"
        >
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#048B9A] font-medium text-lg"
          >
            Chargement
          </motion.p>
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [-2, 2, -2],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-1.5 h-1.5 bg-[#048B9A] rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 