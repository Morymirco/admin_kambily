'use client'
import { useAuth } from '@/app/providers/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import AddAddressModal from './AddAddressModal';

const AddressSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    {[1, 2, 3, 4].map((item) => (
      <div 
        key={item} 
        className="p-4 border rounded-lg animate-pulse"
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0 mt-1" />
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AddressSelector = ({ selectedAddress, onAddressSelect, showAddButton = true }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    addresse: '',
    ville: '',
    pays: '',
    telephone: '',
    latitude: 9.6412,
    longitude: -13.5784,
    is_default: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authFetch } = useAuth();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await authFetch('https://api.kambily.store/addresses/');
      if (!response.ok) throw new Error('Erreur lors de la récupération des adresses');
      const data = await response.json();
      setAddresses(data);
      
      if (!selectedAddress && data.length > 0) {
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        onAddressSelect(defaultAddress);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger les adresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authFetch('https://api.kambily.store/addresses/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'adresse');

      const newAddress = await response.json();
      setAddresses(prev => [...prev, newAddress]);
      if (formData.is_default || addresses.length === 0) {
        onAddressSelect(newAddress);
      }
      
      setShowAddModal(false);
      toast.success('Adresse ajoutée avec succès');
      
      setFormData({
        addresse: '',
        ville: '',
        pays: '',
        telephone: '',
        latitude: 9.6412,
        longitude: -13.5784,
        is_default: false
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible d\'ajouter l\'adresse');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <AddressSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedAddress?.id === address.id 
                ? 'border-[#048B9A] bg-[#048B9A]/5' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => onAddressSelect(address)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                selectedAddress?.id === address.id 
                  ? 'border-[#048B9A] bg-[#048B9A]' 
                  : 'border-gray-300'
              }`}>
                {selectedAddress?.id === address.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{address.addresse}</h3>
                  {address.is_default && (
                    <span className="px-2 py-0.5 bg-[#048B9A]/10 text-[#048B9A] text-xs rounded-full">
                      Par défaut
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{address.ville}</p>
                <p className="text-sm text-gray-600">{address.pays}</p>
                <p className="text-sm text-gray-600 mt-1">{address.telephone}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {showAddButton && (
          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-[160px] border-2 border-dashed border-[#048B9A] rounded-lg flex flex-col items-center justify-center gap-3 text-[#048B9A] hover:bg-[#048B9A]/5 transition-colors"
          >
            <FaPlus className="w-6 h-6" />
            <span>Ajouter une adresse</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddAddressModal
            onSubmit={handleAddAddress}
            onClose={() => setShowAddModal(false)}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressSelector; 