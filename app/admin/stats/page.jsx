'use client'
import { useState } from 'react';
import { 
  FaChartLine, FaChartBar, FaChartPie, 
  FaShoppingCart, FaUsers, FaMoneyBillWave 
} from 'react-icons/fa';

const StatsPage = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Données de démonstration
  const stats = {
    revenue: {
      total: '12.5M',
      percentage: '+24%',
      trend: 'up'
    },
    orders: {
      total: '284',
      percentage: '+18%',
      trend: 'up'
    },
    customers: {
      total: '842',
      percentage: '+12%',
      trend: 'up'
    },
    averageOrder: {
      total: '145K',
      percentage: '-5%',
      trend: 'down'
    }
  };

  const topProducts = [
    { name: 'Ensemble Pyjama', sales: 124, revenue: '8.06M GNF' },
    { name: 'Robe d\'été', sales: 98, revenue: '5.88M GNF' },
    { name: 'Sac à main', sales: 76, revenue: '3.8M GNF' },
    { name: 'Montre', sales: 65, revenue: '3.25M GNF' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:border-[#048B9A]"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
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
            <span className={`text-sm font-medium ${
              stats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.revenue.percentage}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Revenus totaux</h3>
          <p className="text-2xl font-bold">{stats.revenue.total} GNF</p>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <span className={`text-sm font-medium ${
              stats.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.orders.percentage}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Commandes</h3>
          <p className="text-2xl font-bold">{stats.orders.total}</p>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaUsers className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${
              stats.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.customers.percentage}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Nouveaux clients</h3>
          <p className="text-2xl font-bold">{stats.customers.total}</p>
        </div>

        {/* Panier moyen */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaChartLine className="w-6 h-6 text-yellow-600" />
            </div>
            <span className={`text-sm font-medium ${
              stats.averageOrder.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.averageOrder.percentage}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm mb-1">Panier moyen</h3>
          <p className="text-2xl font-bold">{stats.averageOrder.total} GNF</p>
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
              {topProducts.map((product, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 