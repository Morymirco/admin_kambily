'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SmallProductCard from './SmallProductCard';

const ElectronicsSkeleton = () => {
  return (
    <div className="px-4 space-y-4 animate-pulse">
      {/* Skeleton carte principale */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative aspect-square bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>

      {/* Skeleton petites cartes */}
      <div className="space-y-2">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-lg p-2 flex gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="h-2 bg-gray-200 rounded w-14"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ElectronicsSection() {
  const [mainProduct, setMainProduct] = useState(null);
  const [smallProducts, setSmallProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.kambily.store/products/');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          const firstProduct = data.products[2];
          setMainProduct(firstProduct);
          setSmallProducts(data.products.slice(1, 4));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("mainProduct a été mis à jour:", mainProduct);
  }, [mainProduct]);

  if (loading) {
    return <ElectronicsSkeleton />;
  }

  if (!mainProduct || smallProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 space-y-4">
      {/* Carte principale avec navigation */}
      <Link href={`/boutique/${mainProduct.id}`}>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={mainProduct.images[0].image}
              alt={mainProduct.name}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium">
              {mainProduct.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {mainProduct.regular_price && (
                <span className="text-gray-400 line-through text-sm">
                  {mainProduct.regular_price.toLocaleString()}GNF
                </span>
              )}
              <span className="text-[#048B9A] font-medium">
                {mainProduct.promo_price.toLocaleString()}GNF
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
              {mainProduct.etat_stock ? 'En stock' : 'Rupture de stock'}
            </div>
            {mainProduct.short_description && (
              <p className="text-xs text-gray-400 mt-1">
                {mainProduct.short_description}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Petites cartes avec navigation */}
      <div className="space-y-2">
        {smallProducts.map((product) => (
          <Link key={product.id} href={`/boutique/${product.id}`}>
            <SmallProductCard 
              imageUrl={product.images[0].image}
              title={product.name}
              price={product.promo_price}
              originalPrice={product.regular_price}
              inStock={product.etat_stock}
            />
          </Link>
        ))}
      </div>
    </div>
  );
} 