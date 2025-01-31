'use client'
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function NewsletterPromo({
  title = "Restez informé !",
  description = "Inscrivez-vous à notre newsletter pour recevoir nos meilleures offres",
  onClose,
  onSubmit
}) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="relative bg-white rounded-xl shadow-xl w-[calc(100%-16px)] sm:w-[95%] max-w-md p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          className="w-full px-4 py-3 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-[#048B9A] text-white py-3 rounded-lg hover:bg-[#037483]"
        >
          S'inscrire
        </motion.button>
      </form>
    </motion.div>
  );
} 