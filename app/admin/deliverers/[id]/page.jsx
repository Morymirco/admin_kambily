'use client'
import Link from 'next/link';
import { use, useState } from 'react';
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaClock as FaClockAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaMotorcycle,
    FaPhone,
    FaStar
} from 'react-icons/fa';

const DelivererDetailsPage = ({ params }) => {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');

  // Données de démonstration
  const deliverer = {
    id: id,
    name: 'Mamadou Diallo',
    photo: '/deliverers/photo.jpg',
    phone: '+224 621 00 00 00',
    email: 'mamadou.diallo@example.com',
    zone: 'Ratoma',
    status: 'active',
    availability: 'available',
    rating: 4.8,
    joinDate: '2023-12-01',
    stats: {
      totalDeliveries: 145,
      thisMonth: 28,
      onTimeRate: 98,
      cancelRate: 2,
      totalEarnings: 2900000
    },
    recentDeliveries: [
      {
        id: 1,
        orderId: 'CMD-001',
        date: '2024-03-15',
        customer: 'Aissatou Barry',
        amount: 250000,
        status: 'delivered',
        rating: 5
      },
      // ... autres livraisons
    ],
    performance: {
      monthly: [
        { month: 'Jan', deliveries: 32, earnings: 640000 },
        { month: 'Fév', deliveries: 28, earnings: 560000 },
        { month: 'Mar', deliveries: 35, earnings: 700000 },
      ],
      ratings: {
        5: 85,
        4: 12,
        3: 2,
        2: 1,
        1: 0
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/deliverers"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft className="text-gray-500" />
          </Link>
          <h1 className="text-xl font-bold">Détails du livreur</h1>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Modifier
          </button>
          <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            Désactiver
          </button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-3 gap-6">
        {/* Carte profil */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={deliverer.photo}
              alt={deliverer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="font-medium text-lg">{deliverer.name}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <FaMapMarkerAlt size={12} />
                <span>{deliverer.zone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <FaPhone className="text-gray-400" />
              <span>{deliverer.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaEnvelope className="text-gray-400" />
              <span>{deliverer.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaClock className="text-gray-400" />
              <span>Inscrit le {new Date(deliverer.joinDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaStar className="text-yellow-400" />
              <span className="font-medium">{deliverer.rating}</span>
              <span className="text-gray-500">({deliverer.stats.totalDeliveries} livraisons)</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Statut</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                deliverer.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {deliverer.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Disponibilité</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                deliverer.availability === 'available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {deliverer.availability === 'available' ? 'Disponible' : 'Indisponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="col-span-2 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FaMotorcycle className="text-[#048B9A]" />
                <span>Total livraisons</span>
              </div>
              <div className="text-2xl font-semibold">{deliverer.stats.totalDeliveries}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FaCalendarAlt className="text-[#048B9A]" />
                <span>Ce mois</span>
              </div>
              <div className="text-2xl font-semibold">{deliverer.stats.thisMonth}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FaClockAlt className="text-green-600" />
                <span>À l'heure</span>
              </div>
              <div className="text-2xl font-semibold text-green-600">{deliverer.stats.onTimeRate}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <FaMoneyBillWave className="text-[#048B9A]" />
                <span>Gains totaux</span>
              </div>
              <div className="text-2xl font-semibold">{deliverer.stats.totalEarnings.toLocaleString()} GNF</div>
            </div>
          </div>

          {/* Onglets */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b px-4">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === 'overview'
                      ? 'border-[#048B9A] text-[#048B9A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Aperçu
                </button>
                <button
                  onClick={() => setActiveTab('deliveries')}
                  className={`py-4 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === 'deliveries'
                      ? 'border-[#048B9A] text-[#048B9A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Livraisons
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`py-4 text-sm font-medium border-b-2 -mb-px ${
                    activeTab === 'performance'
                      ? 'border-[#048B9A] text-[#048B9A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Performance
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Graphique des livraisons mensuelles */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Livraisons mensuelles</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-end justify-between p-4">
                      {deliverer.performance.monthly.map((data, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div 
                            className="w-12 bg-[#048B9A] rounded-t"
                            style={{ height: `${(data.deliveries/40)*100}%` }}
                          />
                          <div className="text-xs text-gray-500">{data.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distribution des notes */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Distribution des notes</h3>
                    <div className="space-y-2">
                      {Object.entries(deliverer.performance.ratings).reverse().map(([rating, percent]) => (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center gap-1 w-16">
                            <FaStar className="text-yellow-400" size={12} />
                            <span className="text-sm">{rating}</span>
                          </div>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-12">{percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'deliveries' && (
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="px-4 py-3">Commande</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Montant</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {deliverer.recentDeliveries.map((delivery) => (
                        <tr key={delivery.id} className="text-sm">
                          <td className="px-4 py-3 font-medium">{delivery.orderId}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(delivery.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3">{delivery.customer}</td>
                          <td className="px-4 py-3 font-medium">
                            {delivery.amount.toLocaleString()} GNF
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              delivery.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {delivery.status === 'delivered' ? 'Livrée' : 'En cours'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" size={12} />
                              <span>{delivery.rating}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  {/* Graphique des gains */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">Gains mensuels</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-end justify-between p-4">
                      {deliverer.performance.monthly.map((data, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div 
                            className="w-12 bg-green-500 rounded-t"
                            style={{ height: `${(data.earnings/800000)*100}%` }}
                          />
                          <div className="text-xs text-gray-500">{data.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Indicateurs de performance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Taux de livraison à l'heure</h3>
                        <span className="text-green-600 font-medium">{deliverer.stats.onTimeRate}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${deliverer.stats.onTimeRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Taux d'annulation</h3>
                        <span className="text-red-600 font-medium">{deliverer.stats.cancelRate}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${deliverer.stats.cancelRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelivererDetailsPage; 