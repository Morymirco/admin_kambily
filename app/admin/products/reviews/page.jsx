'use client'
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheck, FaSearch, FaStar, FaTrash } from 'react-icons/fa';
import {HOST_IP, PORT, PROTOCOL_HTTP} from "../../../../constants";
import {useRouter} from "next/navigation";

const ReviewsPage = () => {
  const router = useRouter();
  
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: '',
    status: '',
    dateRange: '',
    startDate: '',
    endDate: ''
  });

  // Charger les avis
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/reviews/admin/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          toast.error('Erreur lors du chargement des avis');
          return;
        }

        const data = await response.json();
        console.log(data);
        setReviews(data);
      } catch (err) {
        console.error('Erreur:', err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [router]);

  const handleApprove = async (reviewId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation de l\'avis');
      }

      // Mettre à jour l'état local
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, status: 'approved' }
            : review
        )
      );

      toast.success('Avis approuvé avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'avis');
      }
      console.log(response.json());
      

      // Mettre à jour l'état local
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      toast.success('Avis supprimé avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message);
    }
  };

  const handleRowClick = (reviewId) => {
    router.push(`/admin/products/reviews/${reviewId}`);
  };

  // Filtrer les avis selon les critères
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = (
      (review.comment?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (review.user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    
    const matchesRating = !filters.rating || review.rating === parseInt(filters.rating);
    const matchesStatus = !filters.status || review.status === filters.status;
    
    let matchesDate = true;
    if (filters.startDate && filters.endDate) {
      const reviewDate = new Date(review.created_at);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      matchesDate = reviewDate >= start && reviewDate <= end;
    }

    return matchesSearch && matchesRating && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="p-4 space-y-4 min-h-screen">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Avis clients</h1>
          {selectedReviews.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedReviews.length} avis sélectionné(s)
            </p>
          )}
        </div>
        {selectedReviews.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.success(`${selectedReviews.length} avis approuvé(s)`);
                setSelectedReviews([]);
              }}
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-green-700"
            >
              <FaCheck size={12} />
              Approuver la sélection
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-700"
            >
              <FaTrash size={12} />
              Supprimer la sélection
            </button>
          </div>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Première ligne : Recherche et filtres principaux */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher dans les avis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({...filters, rating: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Toutes les notes</option>
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>{rating} étoiles</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="spam">Spam</option>
          </select>
        </div>

        {/* Deuxième ligne : Filtres de date */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-gray-500">à</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={() => setFilters({
              rating: '',
              status: '',
              dateRange: '',
              startDate: '',
              endDate: ''
            })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Table des avis */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <tr 
                key={review.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  if (e.target.closest('button')) return;
                  handleRowClick(review.id);
                }}
              >
                <td className="px-4 py-4">
                  <div className="font-medium">
                    {review.user?.first_name + ' ' + review.user?.last_name || 'Utilisateur anonyme'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {review.user?.email || 'Email non disponible'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <div className="text-sm font-medium">ID: {review.id}</div>
                      <div className="text-xs text-gray-500">
                        {review.product?.name || 'Nom du produit non disponible'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                        size={14}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {review.comment || 'Aucun commentaire'}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  {review.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(review.id);
                      }}
                      className="text-green-600 hover:text-green-800"
                      title="Approuver"
                    >
                      <FaCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(review.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsPage; 