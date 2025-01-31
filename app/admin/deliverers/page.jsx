'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaMotorcycle, FaPhone, FaSearch, FaTrash } from 'react-icons/fa';
import AddDelivererModal from './components/AddDelivererModal';

const DeliverersPage = () => {
  const router = useRouter();
  const [selectedDeliverers, setSelectedDeliverers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    zone: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const deliverers = [
    {
      id: 1,
      name: 'Mamadou Diallo',
      phone: '+224 621 00 00 00',
      zone: 'Ratoma',
      status: 'active',
      deliveriesCount: 145,
      rating: 4.8,
      currentDelivery: true,
      availability: 'unavailable'
    },
    {
      id: 2,
      name: 'Ibrahima Sow',
      phone: '+224 622 00 00 00',
      zone: 'Matam',
      status: 'inactive',
      deliveriesCount: 89,
      rating: 4.5,
      currentDelivery: false,
      availability: 'available'
    },
    // ... autres livreurs
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDeliverers(deliverers.map(d => d.id));
    } else {
      setSelectedDeliverers([]);
    }
  };

  const handleSelectDeliverer = (delivererId) => {
    setSelectedDeliverers(prev => 
      prev.includes(delivererId)
        ? prev.filter(id => id !== delivererId)
        : [...prev, delivererId]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer ${selectedDeliverers.length} livreur(s) ?`)) {
      toast.success(`${selectedDeliverers.length} livreur(s) supprimé(s)`);
      setSelectedDeliverers([]);
    }
  };

  const handleRowClick = (delivererId) => {
    router.push(`/admin/deliverers/${delivererId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Livreurs</h1>
          {selectedDeliverers.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedDeliverers.length} livreur(s) sélectionné(s)
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {selectedDeliverers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-700"
            >
              <FaTrash size={12} />
              Supprimer la sélection
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#048B9A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#037483]"
          >
            <FaMotorcycle />
            Ajouter un livreur
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un livreur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>

          <select
            value={filters.zone}
            onChange={(e) => setFilters({...filters, zone: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm min-w-[150px]"
          >
            <option value="">Toutes les zones</option>
            <option value="ratoma">Ratoma</option>
            <option value="matam">Matam</option>
            <option value="dixinn">Dixinn</option>
            <option value="kaloum">Kaloum</option>
          </select>
        </div>
      </div>

      {/* Table des livreurs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedDeliverers.length === deliverers.length}
                  onChange={handleSelectAll}
                  className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraisons</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponibilité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliverers.map((deliverer) => (
              <tr 
                key={deliverer.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(deliverer.id)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedDeliverers.includes(deliverer.id)}
                    onChange={() => handleSelectDeliverer(deliverer.id)}
                    className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{deliverer.name}</div>
                  {deliverer.currentDelivery && (
                    <span className="text-xs text-green-600">En livraison</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPhone className="mr-2" size={12} />
                    {deliverer.phone}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {deliverer.zone}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {deliverer.deliveriesCount}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {deliverer.rating}
                    </span>
                    <span className="ml-1 text-yellow-400">★</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    deliverer.availability === 'available'
                      ? 'bg-green-100 text-green-800'
                      : deliverer.availability === 'busy'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {deliverer.availability === 'available' 
                      ? 'Disponible' 
                      : deliverer.availability === 'busy'
                      ? 'Occupé'
                      : 'Indisponible'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    deliverer.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {deliverer.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Link href={`/admin/deliverers/${deliverer.id}`}>
                    <button className="text-[#048B9A] hover:text-[#037483]">
                      <FaEdit size={14} />
                    </button>
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Supprimer ce livreur ?')) {
                        toast.success('Livreur supprimé');
                      }
                    }}
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddDelivererModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default DeliverersPage; 