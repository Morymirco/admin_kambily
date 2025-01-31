'use client'
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaEye, FaSearch, FaTimes, FaTrash, FaUserPlus } from 'react-icons/fa';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    dateRange: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Nouveaux states pour les actions
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fonction de tri
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Données de démonstration étendues
  const users = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      registered: '2024-02-20',
      lastActivity: '2024-02-28 14:30',
      orders: {
        count: 12,
        total: 1250000,
        average: 104166
      },
      location: {
        country: 'Guinée',
        city: 'Conakry',
        address: 'Rue KA 028, Kaloum'
      },
      billingInfo: {
        phone: '+224 621 00 00 00'
      }
    },
    // ... autres utilisateurs
  ];

  // Tri des utilisateurs
  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  // Fonction pour le rendu de l'icône de tri
  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  const roles = [
    { id: 'customer', name: 'Client' },
    { id: 'subscriber', name: 'Abonné' },
    { id: 'contributor', name: 'Contributeur' },
    { id: 'admin', name: 'Administrateur' }
  ];

  const dateRanges = [
    { id: 'today', name: "Aujourd'hui" },
    { id: 'week', name: '7 derniers jours' },
    { id: 'month', name: '30 derniers jours' },
    { id: 'quarter', name: '3 derniers mois' },
    { id: 'year', name: 'Cette année' }
  ];

  // Fonctions de gestion des actions
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Utilisateur supprimé avec succès');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  // Composant Modal réutilisable
  const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Ajouter avant le return existant
  const renderUserDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-[#048B9A]/10 flex items-center justify-center text-[#048B9A] text-xl font-medium">
          {selectedUser?.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-medium">{selectedUser?.name}</h4>
          <p className="text-sm text-gray-500">{selectedUser?.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Téléphone</p>
          <p>{selectedUser?.billingInfo.phone}</p>
        </div>
        <div>
          <p className="text-gray-500">Adresse</p>
          <p>{selectedUser?.location.address}</p>
        </div>
        <div>
          <p className="text-gray-500">Commandes</p>
          <p>{selectedUser?.orders.count} commandes</p>
        </div>
        <div>
          <p className="text-gray-500">Total dépensé</p>
          <p>{selectedUser?.orders.total.toLocaleString()} GNF</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* En-tête plus compact */}
      <div className="flex justify-between items-center py-2">
        <div>
          <h1 className="text-xl font-bold">Utilisateurs</h1>
          <p className="text-xs text-gray-500">
            Gérez les utilisateurs de votre boutique
          </p>
        </div>
        <Link href="/admin/users/add">
          <button className="bg-[#048B9A] text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 hover:bg-[#037483]">
            <FaUserPlus size={14} />
            Ajouter
          </button>
        </Link>
      </div>

      {/* Filtres et recherche plus compacts */}
      <div className="bg-white p-3 rounded-lg shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg"
            />
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
          </div>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="border rounded-lg px-2 py-1.5 text-sm min-w-[120px]"
          >
            <option value="">Rôle</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-lg px-2 py-1.5 text-sm min-w-[120px]"
          >
            <option value="">Statut</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="border rounded-lg px-2 py-1.5 text-sm min-w-[120px]"
          >
            <option value="">Période</option>
            {dateRanges.map(range => (
              <option key={range.id} value={range.id}>{range.name}</option>
            ))}
          </select>
        </div>

        {/* Stats en ligne */}
        <div className="flex gap-3 text-xs border-t pt-2">
          {[
            { label: 'Total', value: '1,234' },
            { label: 'Nouveaux', value: '56' },
            { label: 'Actifs', value: '789' },
            { label: 'Moy. commandes', value: '3.2' }
          ].map((stat, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-gray-500">{stat.label}:</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table optimisée */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'name', label: 'Nom' },
                { key: 'username', label: 'ID' },
                { key: 'lastActivity', label: 'Activité' },
                { key: 'registered', label: 'Inscription' },
                { key: 'email', label: 'E-mail' },
                { key: 'orders.count', label: 'Cmd.' },
                { key: 'orders.total', label: 'Total' },
                { key: 'orders.average', label: 'Moy.' },
                { key: 'location.country', label: 'Pays' },
                { key: 'location.city', label: 'Ville' }
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {col.label} {renderSortIcon(col.key)}
                </th>
              ))}
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-[#048B9A]/10 flex items-center justify-center text-[#048B9A] text-xs font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <span className="ml-2 font-medium text-xs">{user.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs">{user.username}</td>
                <td className="px-3 py-2 text-xs">{user.lastActivity}</td>
                <td className="px-3 py-2 text-xs">
                  {new Date(user.registered).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-xs">{user.email}</td>
                <td className="px-3 py-2 text-xs">{user.orders.count}</td>
                <td className="px-3 py-2 text-xs">{user.orders.total.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{user.orders.average.toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{user.location.country}</td>
                <td className="px-3 py-2 text-xs">{user.location.city}</td>
                <td className="px-3 py-2 text-right space-x-1">
                  <button 
                    onClick={() => handleView(user)}
                    className="text-[#048B9A] hover:text-[#037483]"
                  >
                    <FaEye size={12} />
                  </button>
                  <button 
                    onClick={() => handleEdit(user)}
                    className="text-[#048B9A] hover:text-[#037483]"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Détails de l'utilisateur"
      >
        {selectedUser && renderUserDetails()}
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier l'utilisateur"
      >
        {/* Formulaire d'édition */}
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              disabled={isProcessing}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isProcessing ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage; 