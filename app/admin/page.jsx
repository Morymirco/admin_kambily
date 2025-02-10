'use client'
import { useState, useEffect } from 'react';
import { 
  FaChartLine, FaChartBar, FaChartPie, 
  FaShoppingCart, FaUsers, FaMoneyBillWave 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { HOST_IP, PORT, PROTOCOL_HTTP } from '@/constants';
import WithAuth from '@/app/hoc/WithAuth';
const StatsPage = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/managers/dashboard/detailed-stats/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
        const data = await response.json();
        console.log(data);
        setStats(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la récupération des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Chargement des statistiques...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 text-red-500">Impossible de charger les statistiques</div>;
  }

  const currentStats = stats[timeRange];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:border-[#048B9A]"
        >
          <option value="today">Aujourd'hui</option>
          <option value="this_week">Cette semaine</option>
          <option value="this_month">Ce mois</option>
          <option value="this_year">Cette année</option>
        </select>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenus */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaMoneyBillWave className="w-6 h-6 text-blue-600" />
            </div>
            {/* Ajoutez ici la logique pour le pourcentage si nécessaire */}
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Revenus totaux</h3>
          <p className="text-2xl font-bold">{currentStats.revenue.toLocaleString()} GNF</p>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            {/* Ajoutez ici la logique pour le pourcentage si nécessaire */}
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Commandes</h3>
          <p className="text-2xl font-bold">{currentStats.orders}</p>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaUsers className="w-6 h-6 text-green-600" />
            </div>
            {/* Ajoutez ici la logique pour le pourcentage si nécessaire */}
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Nouveaux clients</h3>
          <p className="text-2xl font-bold">{currentStats.users}</p>
        </div>

        {/* Produits */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaChartLine className="w-6 h-6 text-yellow-600" />
            </div>
            {/* Ajoutez ici la logique pour le pourcentage si nécessaire */}
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Produits ajoutés</h3>
          <p className="text-2xl font-bold">{currentStats.products}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des ventes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Évolution des ventes</h2>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Graphique à venir</p>
          </div>
        </div>

        {/* Répartition des ventes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Répartition par catégorie</h2>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Graphique à venir</p>
          </div>
        </div>
      </div>

      {/* Meilleurs produits */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Meilleurs produits</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ventes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* {currentStats.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.revenue}
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(StatsPage); 