'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function ProductGrid({ products, fullWidthIndex }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-lg shadow-md overflow-hidden
            ${index === fullWidthIndex ? 'sm:col-span-2 md:col-span-2 lg:col-span-2' : ''}`}
        >
          <div className="relative group">
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                    <FaHeart className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                    <FaShoppingCart className="w-5 h-5 text-[#048B9A]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-[#048B9A] transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#048B9A]">
                  {product.price} GNF
                </span>
                {product.old_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.old_price} GNF
                  </span>
                )}
              </div>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 