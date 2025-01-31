'use client'
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CategoryDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`https://api.kambily.store/categories/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
        );
        if (!response.ok) throw new Error('Erreur lors de la récupération de la catégorie');
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la récupération de la catégorie');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const response = await fetch(`https://api.kambily.store/categories/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression de la catégorie');

      toast.success('Catégorie supprimée avec succès');
      router.push('/admin/products/categories');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Catégorie non trouvée</p>
        <button 
          onClick={() => router.push('/admin/products/categories')}
          className="mt-4 text-[#048B9A] hover:underline"
        >
          Retourner à la liste des catégories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push(`/admin/products/categories/${id}/edit`)}
            className="text-[#048B9A] hover:text-[#037483]"
          >
            <FaEdit size={18} />
          </button>
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Détails de la catégorie</h2>
        {category.image && (
          <div className="mb-4">
            <Image
              src={category.image.image}
              alt={category.name}
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <p><strong>Description:</strong> {category.description || 'Aucune description'}</p>
        <p><strong>Catégorie parente:</strong> {category.parent_category || 'Aucune'}</p>
        <p><strong>Nombre de produits:</strong> {category.x || 0}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Produits dans cette catégorie</h2>
        {category.products && category.products.length > 0 ? (
          <ul className="space-y-4">
            {category.products.map((product) => (
              <li key={product.id} className="flex items-center gap-4">
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.price} GNF</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun produit dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail; 