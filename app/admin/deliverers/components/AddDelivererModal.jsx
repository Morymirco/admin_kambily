'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

const AddDelivererModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zone: '',
    email: '',
    password: '',
    confirmPassword: '',
    idCard: null,
    photo: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    // Logique d'ajout du livreur
    toast.success('Livreur ajouté avec succès');
    onClose();
    setFormData({
      name: '',
      phone: '',
      zone: '',
      email: '',
      password: '',
      confirmPassword: '',
      idCard: null,
      photo: null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Ajouter un livreur</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Informations personnelles */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Zone</label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({...formData, zone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              >
                <option value="">Sélectionner une zone</option>
                <option value="ratoma">Ratoma</option>
                <option value="matam">Matam</option>
                <option value="dixinn">Dixinn</option>
                <option value="kaloum">Kaloum</option>
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                accept="image/*"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Carte d'identité</label>
              <input
                type="file"
                onChange={(e) => setFormData({...formData, idCard: e.target.files[0]})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                accept="image/*"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#048B9A] text-white rounded-lg text-sm hover:bg-[#037483]"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDelivererModal; 