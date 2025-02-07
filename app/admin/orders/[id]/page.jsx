'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaBox, FaTruck, FaUser } from 'react-icons/fa';
import { PROTOCOL_HTTP, HOST_IP, PORT } from '../../../../constants';

const OrderDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/orders/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération de la commande');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la récupération de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };
    return texts[status] || status;
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Commande non trouvée</p>
        <button 
          onClick={() => router.push('/admin/orders')}
          className="mt-4 text-[#048B9A] hover:underline"
        >
          Retourner à la liste des commandes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => router.push('/admin/orders')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Retour aux commandes
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Commande {order.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#048B9A]" /> Informations client
                </h2>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Nom:</span> {order.customer}</p>
                  <p><span className="text-gray-500">Email:</span> {order.email}</p>
                  <p><span className="text-gray-500">Téléphone:</span> {order.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4 flex items-center">
                  <FaTruck className="mr-2 text-[#048B9A]" /> Livraison
                </h2>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Adresse:</span> {order.delivery_address}</p>
                  <p><span className="text-gray-500">Livreur:</span> {order.delivery?.name || 'Non assigné'}</p>
                  <p><span className="text-gray-500">Statut:</span> {order.delivery?.status}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4 flex items-center">
                  <FaBox className="mr-2 text-[#048B9A]" /> Produits commandés
                </h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.price.toLocaleString()} GNF</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-semibold">Total</p>
                    <p className="font-semibold text-lg">{order.total.toLocaleString()} GNF</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Paiement</h2>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Méthode:</span> {order.payment}</p>
                  <p><span className="text-gray-500">Date:</span> {new Date(order.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;