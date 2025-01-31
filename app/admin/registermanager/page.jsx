'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEnvelope, FaFileUpload, FaIdCard, FaLock, FaPhone, FaTimes, FaTruck, FaUser } from 'react-icons/fa';

export default function RegisterManager() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'logistics_manager',
    idCard: null,
    proofOfAddress: null,
    permissions: {
      orders: true,
      deliveries: true,
      deliverers: true
    }
  });

  const [previewUrls, setPreviewUrls] = useState({
    idCard: null,
    proofOfAddress: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }

      // Créer l'URL de prévisualisation
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => ({
        ...prev,
        [type]: previewUrl
      }));

      // Mettre à jour le formData
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const removeFile = (type) => {
    // Libérer l'URL de prévisualisation
    if (previewUrls[type]) {
      URL.revokeObjectURL(previewUrls[type]);
    }

    // Réinitialiser les états
    setPreviewUrls(prev => ({
      ...prev,
      [type]: null
    }));
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Gestionnaire logistique créé avec succès');
      // Réinitialiser le formulaire
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'logistics_manager',
        idCard: null,
        proofOfAddress: null,
        permissions: {
          orders: true,
          deliveries: true,
          deliverers: true
        }
      });
    } catch (error) {
      toast.error('Erreur lors de la création du compte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full px-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#048B9A]/10 rounded-lg">
            <FaTruck className="w-6 h-6 text-[#048B9A]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ajouter un gestionnaire logistique</h1>
            <p className="text-sm text-gray-500">
              Créez un compte pour le responsable de la gestion logistique
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grille principale */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne de gauche - Informations personnelles */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Informations personnelles</h2>
              
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email professionnel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Colonne centrale - Sécurité et permissions */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Sécurité et permissions</h2>
              
              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    required
                  />
                </div>
              </div>

              {/* Confirmer le mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    required
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.orders}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: {...formData.permissions, orders: e.target.checked}
                      })}
                      className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                    />
                    <span className="ml-2 text-sm text-gray-600">Gestion des commandes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.deliveries}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: {...formData.permissions, deliveries: e.target.checked}
                      })}
                      className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                    />
                    <span className="ml-2 text-sm text-gray-600">Gestion des livraisons</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.deliverers}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: {...formData.permissions, deliverers: e.target.checked}
                      })}
                      className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                    />
                    <span className="ml-2 text-sm text-gray-600">Gestion des livreurs</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Colonne de droite - Documents */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FaIdCard className="text-[#048B9A]" />
                Documents d'identité
              </h2>

              {/* Carte d'identité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carte d'identité
                </label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {previewUrls.idCard ? (
                    <div className="relative">
                      <img 
                        src={previewUrls.idCard} 
                        alt="Aperçu carte d'identité" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('idCard')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                      <FaFileUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Cliquez pour ajouter votre carte d'identité
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG jusqu'à 5MB
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'idCard')}
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Justificatif de domicile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificatif de domicile
                </label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {previewUrls.proofOfAddress ? (
                    <div className="relative">
                      <img 
                        src={previewUrls.proofOfAddress} 
                        alt="Aperçu justificatif" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('proofOfAddress')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                      <FaFileUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Cliquez pour ajouter un justificatif de domicile
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG jusqu'à 5MB
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                        required
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#048B9A] text-white rounded-lg text-sm hover:bg-[#037483] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <span>Créer le compte</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 