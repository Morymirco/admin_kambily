'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTrash, FaStar, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import { PROTOCOL_HTTP, HOST_IP, PORT } from '../../../../../constants';

const ReviewDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/reviews/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'avis');
        const data = await response.json();
        setReview(data);
        console.log("data",data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la récupération de l\'avis');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [id]);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/reviews/${id}/approve/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de l\'approbation');
      
      setReview(prev => ({ ...prev, status: 'approved' }));
      toast.success('Avis approuvé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'approbation de l\'avis');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/reviews/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      toast.success('Avis supprimé avec succès');
      router.push('/admin/products/reviews');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de l\'avis');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Avis non trouvé</p>
        <button 
          onClick={() => router.push('/admin/products/reviews')}
          className="mt-4 text-[#048B9A] hover:underline"
        >
          Retourner à la liste des avis
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => router.push('/admin/products/reviews')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Retour aux avis
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Détail de l'avis #{id}</h1>
              <div className="flex gap-3">
                {review.status === 'pending' && (
                  <button 
                    onClick={handleApprove}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 flex items-center"
                  >
                    <FaCheck className="mr-2" /> Approuver
                  </button>
                )}
                <button 
                  onClick={handleDelete}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center"
                >
                  <FaTrash className="mr-2" /> Supprimer
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Produit</h2>
                <div className="flex gap-4">
                  {review.product?.images?.slice(0, 2).map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <Image
                        src={image}
                        alt={`${review.product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <h3 className="font-medium mt-3">{review.product?.name}</h3>
                <p className="text-sm text-gray-500">ID: {review.product?.id}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Utilisateur</h2>
                <div className="space-y-2">
                  <p className="font-medium">{review.user?.first_name} {review.user?.last_name}</p>
                  <p className="text-gray-500">{review.user?.email}</p>
                  <p className="text-sm text-gray-500">ID: {review.user?.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Évaluation</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                        size={24}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium ml-2">{review.rating}/5</span>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Informations</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Statut:</span>
                    <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm ${
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {review.status === 'approved' ? 'Approuvé' :
                       review.status === 'pending' ? 'En attente' : 'Spam'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Créé le:</span>
                    <span className="ml-2">{new Date(review.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;