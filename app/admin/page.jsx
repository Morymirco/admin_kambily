'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getAxiosConfig, HOST_IP, PORT, PROTOCOL_HTTP } from '../../constants';
import WithAuth from '../hoc/WithAuth';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Token not found');
        }
// ${PROTOCOL_HTTP}://${HOST_IP}${PORT}/managers/dashboard/detailed-stats/
        const response = await axios.get(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/managers/dashboard/detailed-stats/`, getAxiosConfig(token));
        setStats(response.data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Commandes récentes</h2>
          <div className="space-y-4">
            {/* Placeholder for orders list */}
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center py-3 border-b">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Analyse des ventes</h2>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Placeholder for chart */}
            <p className="text-gray-500">Graphique des ventes à venir</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(Dashboard); 