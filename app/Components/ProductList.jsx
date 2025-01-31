'use client'
import { useEffect } from 'react';
import useStore from '../hooks/useStore';


export default function ProductList() {
  const { products, loading, error } = useApi();
  const { setProducts, products: storeProducts } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await products.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {storeProducts.map(product => (
        <div key={product.id}>
          {product.name}
        </div>
      ))}
    </div>
  );
} 