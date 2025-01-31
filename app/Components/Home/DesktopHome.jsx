'use client'
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Collection from '@/app/Components/Collection';
import Features from '@/app/Components/NavBar/features';
import Hero from '@/app/Components/NavBar/Hero';
import PromoPopup from '@/app/Components/Popup/PromoPopup';
import Produits from '@/app/Components/Produit';
import Promo from '@/app/Components/Promo';
import Tendance from '@/app/Components/Tendance';
import Spinner from '@/app/Components/ui/Spinner';

// Définition des données de produits
const products = [
  {
    id: 1,
    image: "/products/product1.jpg",
    title: "Produit 1",
    price: 65000,
    inStock: true
  },
  {
    id: 2,
    image: "/products/product2.jpg",
    title: "Produit 2",
    price: 75000,
    inStock: true
  },
  // ... autres produits
];

export default function DesktopHome() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message envoyé avec succès !');
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <Features />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <Produits />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Promo />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <Tendance />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Collection products={products} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#F5F5F5] py-16 md:py-24"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Restez connecté avec nous
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-8"
            >
              Inscrivez-vous à notre newsletter pour recevoir nos dernières offres et actualités
            </motion.p>
            
            <motion.form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#048B9A] focus:border-[#048B9A] outline-none"
                disabled={isSubmitting}
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#048B9A] text-white rounded-lg hover:bg-[#037483] transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? (
                  <Spinner size={5} />
                ) : (
                  "S'abonner"
                )}
              </motion.button>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500 mt-4"
            >
              En vous inscrivant, vous acceptez de recevoir nos newsletters. Vous pouvez vous désabonner à tout moment.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <PromoPopup />
    </main>
  );
} 