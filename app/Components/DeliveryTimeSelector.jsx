'use client'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaInfoCircle, FaMoneyBillWave, FaTruck } from 'react-icons/fa';

const DeliveryTimeSelector = ({ onSelect }) => {
  const DELIVERY_FEE = 3000;
  const [deliveryInfo, setDeliveryInfo] = useState({
    estimatedDate: null,
    message: '',
    delay: '',
    type: '',
    deliveryFee: DELIVERY_FEE
  });

  useEffect(() => {
    calculateDeliveryInfo();
  }, []);

  const calculateDeliveryInfo = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const currentHour = now.getHours();
    let estimatedDate = new Date(now);
    let message = '';
    let delay = '';
    let type = '';

    // Fonction pour ajouter des jours en évitant les weekends
    const addBusinessDays = (date, days) => {
      let result = new Date(date);
      let addedDays = 0;
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          addedDays++;
        }
      }
      // Définir l'heure à 8h du matin
      result.setHours(8, 0, 0, 0);
      return result;
    };

    // Jeudi après 20H au Dimanche avant 20h → Livraison Lundi (72H)
    if ((currentDay === 4 && currentHour >= 20) || 
        currentDay === 5 || 
        currentDay === 6 || 
        (currentDay === 0 && currentHour < 20)) {
      estimatedDate = addBusinessDays(now, 3);
      message = "Commande traitée le lundi matin";
      delay = "72H";
      type = "standard_72";
    }
    // Dimanche après 20H au Mardi avant 20H → Livraison Mercredi (48H)
    else if ((currentDay === 0 && currentHour >= 20) || 
             currentDay === 1 || 
             (currentDay === 2 && currentHour < 20)) {
      estimatedDate = addBusinessDays(now, 2);
      message = "Commande traitée le mercredi matin";
      delay = "48H";
      type = "standard_48_wed";
    }
    // Mardi après 20H au Jeudi avant 20h → Livraison Vendredi (48H)
    else if ((currentDay === 2 && currentHour >= 20) || 
             currentDay === 3 || 
             (currentDay === 4 && currentHour < 20)) {
      estimatedDate = addBusinessDays(now, 2);
      message = "Commande traitée le vendredi matin";
      delay = "48H";
      type = "standard_48_fri";
    }

    const newDeliveryInfo = { estimatedDate, message, delay, type, deliveryFee: DELIVERY_FEE };
    setDeliveryInfo(newDeliveryInfo);
    onSelect && onSelect(newDeliveryInfo);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FaTruck className="text-[#048B9A]" />
        Mode d'expédition
      </h3>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border rounded-lg p-4 bg-white"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#048B9A] rounded-full text-white">
            <FaCalendarAlt className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-medium text-lg">Livraison standard</h4>
              <p className="text-[#048B9A] font-medium">
                Livraison estimée le {formatDate(deliveryInfo.estimatedDate)}
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>{deliveryInfo.message}</p>
              <p>Délai de livraison : {deliveryInfo.delay}</p>
            </div>

            <div className="flex items-center gap-2 py-2 px-3 bg-[#048B9A]/5 rounded-lg">
              <FaMoneyBillWave className="text-[#048B9A]" />
              <span className="text-sm font-medium">
                Frais de livraison : {DELIVERY_FEE.toLocaleString('fr-FR')} GNF
              </span>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-2">
              <FaInfoCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Informations importantes :</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>Les livraisons sont effectuées du lundi au vendredi</li>
                  <li>Horaires de livraison : 8h - 18h</li>
                  <li>Pas de livraison les weekends et jours fériés</li>
                  <li>Frais de livraison fixes : 3 000 GNF</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryTimeSelector; 