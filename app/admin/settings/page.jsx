'use client'
import { useState } from 'react';
import { FaSave, FaStore, FaShippingFast, FaEnvelope, FaBell } from 'react-icons/fa';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    storeName: 'Kambily',
    storeEmail: 'contact@kambily.com',
    storePhone: '+224 624 00 00 00',
    currency: 'GNF',
    deliveryFee: '25000',
    freeShippingThreshold: '350000',
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implémenter la sauvegarde des paramètres
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Onglets */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'general', icon: FaStore, label: 'Général' },
            { id: 'shipping', icon: FaShippingFast, label: 'Livraison' },
            { id: 'notifications', icon: FaBell, label: 'Notifications' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#048B9A] text-[#048B9A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paramètres généraux */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la boutique
              </label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="text"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
              >
                <option value="GNF">GNF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        )}

        {/* Paramètres de livraison */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de livraison standard
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="deliveryFee"
                  value={settings.deliveryFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  GNF
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil de livraison gratuite
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  GNF
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Paramètres de notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Notifications par email
                </h3>
                <p className="text-sm text-gray-500">
                  Recevoir les notifications par email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#048B9A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Notifications de commandes
                </h3>
                <p className="text-sm text-gray-500">
                  Recevoir une notification pour chaque nouvelle commande
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="orderNotifications"
                  checked={settings.orderNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#048B9A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Alertes de stock
                </h3>
                <p className="text-sm text-gray-500">
                  Recevoir une alerte quand le stock est bas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="stockAlerts"
                  checked={settings.stockAlerts}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#048B9A]"></div>
              </label>
            </div>
          </div>
        )}

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-[#048B9A] text-white px-4 py-2 rounded-lg hover:bg-[#037082]"
          >
            <FaSave className="w-5 h-5" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 