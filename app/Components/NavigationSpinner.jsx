'use client'
import { motion } from 'framer-motion';

const NavigationSpinner = () => {
  return (
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        exit={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-2 bg-gradient-to-r from-[#C4DE85] to-[#93a968] origin-left"
      >
        <motion.div
          animate={{
            x: ['0%', '100%'],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-full bg-white/30 blur-sm"
        />
      </motion.div>
    </div>
  );
};

export default NavigationSpinner; 