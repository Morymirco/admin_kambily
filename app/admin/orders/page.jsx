'use client'
import WithAuth from '@/app/hoc/WithAuth';
import { getAxiosConfig, HOST_IP, PORT, PROTOCOL_HTTP } from '@/constants';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCalendar, FaEye, FaSearch, FaTrash } from 'react-icons/fa';

const OrdersPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    payment: '',
    dateRange: '',
    deliveryStatus: '',
    startDate: '',
    endDate: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/orders/admin/`, getAxiosConfig(token));
        
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        console.log(response.data.orders);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer ${selectedOrders.length} commandes ?`)) {
      // Logique de suppression
      toast.success(`${selectedOrders.length} commandes supprimées`);
      setSelectedOrders([]);
    }
  };

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

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-[#048B9A] text-white rounded hover:bg-[#037483]"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec actions groupées */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Gestion des commandes</h1>
          <p className="text-xs text-gray-500">
            {selectedOrders.length} commande(s) sélectionnée(s)
          </p>
        </div>
        {selectedOrders.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-700"
          >
            <FaTrash size={12} />
            Supprimer la sélection
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Première ligne de filtres */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-3 py-2 border rounded-lg text-sm flex items-center gap-2 hover:border-[#048B9A]"
            >
              <FaCalendar className="text-gray-400" />
              Période
            </button>
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-4 z-10 border w-72">
                <div className="space-y-3">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Deuxième ligne de filtres */}
        <div className="flex gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En traitement</option>
            <option value="shipped">Expédié</option>
            <option value="delivered">Livré</option>
            <option value="cancelled">Annulé</option>
          </select>
          <select
            value={filters.payment}
            onChange={(e) => setFilters({...filters, payment: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Tous les paiements</option>
            <option value="om">Orange Money</option>
            <option value="momo">MTN Money</option>
            <option value="card">Carte bancaire</option>
          </select>
          <select
            value={filters.deliveryStatus}
            onChange={(e) => setFilters({...filters, deliveryStatus: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Statut livraison</option>
            <option value="assigned">Assigné</option>
            <option value="pending">En attente</option>
            <option value="none">Non assigné</option>
          </select>
        </div>
      </div>

      {/* Table des commandes */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={handleSelectAll}
                  className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Livreur
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/admin/orders/${order.number}`)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.total_products} articles
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user.first_name} {order.user.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : 'Date invalide'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total_price.toLocaleString()} GNF
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.payment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.deliverer ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.deliverer.user.first_name} {order.deliverer.user.last_name}
                      </div>
                      <div className="text-xs text-green-600">
                        Assigné
                      </div>
                    </div>
                  ) : order.deliverer ? (
                    <div className="text-xs text-yellow-600">
                      En attente d'assignation
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Non assigné
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="text-[#048B9A] hover:text-[#037483]"
                  >
                    <FaEye />
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

export default WithAuth(OrdersPage); 