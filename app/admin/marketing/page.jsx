'use client'
import {useEffect, useState} from 'react';
import {FaAd, FaBell, FaEdit, FaGift, FaTrash} from 'react-icons/fa';
import {HOST_IP, PORT, PROTOCOL_HTTP} from "../../constants";
import toast, {Toaster} from "react-hot-toast";

const MarketingPage = () => {
  // États pour les différentes sections
  const [activeTab, setActiveTab] = useState('promos');

  const [newPromo, setNewPromo] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: 0,
    max_discount: 10000,
    minimum_order_amount: 125000, // ou 'fixed'
    is_active: true,
    start_date: new Date(),
    end_date: new Date()
  });
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    image: null,
    link: '',
    startDate: '',
    endDate: '',
    position: 'banner' // ou 'popup', 'sidebar'
  });

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [codePromo, setCodePromo] = useState([])
  
  function fetchCodePromo(){
    const promise = fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/promocode/`, {
      method : 'GET',
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    promise.then(res => res.json())
    .then(res => {
      console.log(res)
      setCodePromo(res)
    })
  }
  
  const validateForm = () => {
    if (!newPromo.code){
      setError("Le code promo est requis.")
      return false
    }
    else if (!newPromo.discount_value || newPromo.discount_value <= 0){
      setError("La valeur de la réduction doit être superieur à 0")
      return false
    }
    else if (newPromo.discount_type === 'percentage' && (newPromo.discount_value > 100 || !newPromo.max_discount)) {
      setError ("Pourcentage invalide ou limite maximale non définie.")
      return false
    }
    else if (!newPromo.start_date){
      setError("La date de début est requise.")
      return false
    }
    else if (!newPromo.end_date){
      setError("La date de fin est requise.");
      return false
    }
    else if (new Date(newPromo.start_date) >= new Date(newPromo.end_date)){
      setError("La date de début doit précéder la date de fin.");
      return false
    }
    return true
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPromo({ ...newPromo, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm();
    if( !validation ) return;

    console.log(newPromo)
    alert(JSON.stringify(newPromo, null, 2))
    
    const data = new FormData();
    data.append('code', newPromo.code);
    data.append('discount_type', newPromo.discount_type);
    data.append('discount_value', newPromo.discount_value);
    data.append('max_discount', newPromo.max_discount);
    data.append('minimum_order_amount', newPromo.minimum_order_amount);
    data.append('start_date', newPromo.start_date instanceof Date ? newPromo.start_date.toISOString() : new Date(newPromo.start_date).toISOString() );
    data.append('end_date', newPromo.end_date instanceof Date ? newPromo.end_date.toISOString() : new Date(newPromo.end_date).toISOString() );
    
    const promise = fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/promocode/create/`, {
      method : 'POST',
      body : data,
      headers : {
        'Authorization' : `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    promise.then(res => res.json())
    .then(res => {
      console.log(res)
      alert(JSON.stringify(res, null, 2));
      setError(null)
      setSuccess('Code promo crée avec succéss')
    })
    .catch(err => {
      console.log(err)
      alert(JSON.stringify(err, null, 2))
    })
  };

  // Exemple de données
  const promos = [
    { id: 1, code: 'SUMMER23', discount: '20%', status: 'active', uses: 45 },
    { id: 2, code: 'WELCOME', discount: '10€', status: 'expired', uses: 120 }
  ];

  const ads = [
    { id: 1, title: 'Soldes d\'été', status: 'active', views: 1200 },
    { id: 2, title: 'Black Friday', status: 'scheduled', views: 0 }
  ];

  useEffect(()=>{
    fetchCodePromo()
  }, [])
  
  function handleDelete (promo_id) {
    fetch (`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/promocode/delete/${promo_id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem ('access_token')}`,
        'Content-Type': 'application/json'
      }
    })
        .then (res => {
          if ( !res.ok) {
            setError('Erreur lors de la suppression du code promo.');
          }
          return res.json ();
        })
        .then (response => {
          console.log ('Code promo supprimé:', response);
          setSuccess('Code promo supprimé avec succès.');
          fetchCodePromo()
        })
        .catch (err => {
          console.error (err);
          alert ('Une erreur s\'est produite lors de la suppression du code promo.');
        });
  }
  
  const switchCodeProme =  (promo_id) => {
    // Affiche un toast de chargement
    const loadingToast = toast.loading('Modification du statut en cours...');
    
    try{
      fetch (`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/promocode/switch/${promo_id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem ('access_token')}`,
          'Content-Type': 'application/json'
        }
      })
          .then((value)=>{
            return value.json()
          })
          .then((data)=>{
            setCodePromo(prevTags => [...prevTags, data]);
            toast.success('Tag ajouté avec succès');
            // Met à jour le toast avec un succès
            toast.update(loadingToast, {
              render: 'Tag ajouté avec succès',
              type: toast.TYPE.SUCCESS,
              isLoading: false,
              autoClose: 3000,
            });
            
            // Met à jour le toast avec un succès
            toast.success("Tag ajouté avec succès", { id: loadingToast });
            
            // reinitialise les données
            setNewPromo({
              code: '',
              is_active: true,
              start_date: new Date(),
              end_date: new Date() ,
              discount_type: 'percent',
              discount_value: 0,
              minimum_order_amount: 0,
              max_discount: 0
            });
          })
          .catch(reason => {
            console.log(reason)
            toast.error('Une erreur s\'est produite lors de la modification du statut du code promo.', {id: loadingToast});
          })
    }catch (e) {
      toast.error('Une erreur s\'est produite lors de la modification du statut du code promo.');
    }finally {
    }
  };

  
  return (
    <div className="space-y-6">
      <Toaster/>
      <h1 className="text-2xl font-bold">Marketing</h1>
      {/* Onglets */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('promos')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'promos' 
              ? 'text-[#048B9A]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaGift />
            Codes Promo
          </div>
          {activeTab === 'promos' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#048B9A]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'ads' 
              ? 'text-[#048B9A]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaAd />
            Publicités
          </div>
          {activeTab === 'ads' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#048B9A]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'notifications' 
              ? 'text-[#048B9A]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FaBell />
            Notifications
          </div>
          {activeTab === 'notifications' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#048B9A]" />
          )}
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {/* Codes Promo */}
        {activeTab === 'promos' && (
            <div className="space-y-6">
              {
                  error &&
                  <div className="error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <p>{error}</p>
                  </div>
              }
              {
                  success &&
                  <div className="success bg-green-300 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <p>{success}</p>
                  </div>
              }
              {/* Formulaire d'ajout */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <input
                        type="text"
                        name="code"
                        value={newPromo.code}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg border-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de réduction</label>
                    <select
                        name="discount_type"
                        value={newPromo.discount_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="percentage">Pourcentage</option>
                      <option value="fixed">Fixe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valeur de la réduction en % ou fixe</label>
                    <input
                        type="number"
                        name="discount_value"
                        value={newPromo.discount_value}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg border-gray-300`}
                    />
                  </div>
                  {newPromo.discount_type === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Réduction maximale
                        </label>
                        <input
                            type="number"
                            name="max_discount"
                            value={newPromo.max_discount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant minimum de la commande
                    </label>
                    <input
                        type="number"
                        name="minimum_order_amount"
                        value={newPromo.minimum_order_amount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                        type="datetime-local"
                        name="start_date"
                        value={newPromo.start_date.toISOString()}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                        type="datetime-local"
                        name="end_date"
                        value={newPromo.end_date.toString()}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <button
                    type="submit"
                    className="
                      mt-4 bg-[#048B9A] text-white px-4 py-2 rounded-lg w-full
                      hover:bg-[#037483]
                    "
                >
                  Créer le code promo
                </button>
              </form>
              
              {/* Liste des codes promo */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réduction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réduction Maximale
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant minimum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
                    {/*  Début*/}
                    {/*</th>*/}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fin
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {codePromo.map ((promo) => (
                      <tr key={promo.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium">{promo.code}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {promo.discount_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {promo.discount_value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {promo.max_discount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {promo.minimum_order_amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    promo.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                              {promo.is_active ? 'Actif' : 'Inactif'}
                            </span>
                            <input type="checkbox" checked={promo.is_active} onChange={()=> switchCodeProme(promo.id)}/>
                          </div>
                        </td>
                        {/*<td className="px-6 py-4 whitespace-nowrap">*/}
                        {/*  {promo.start_date}*/}
                        {/*</td>*/}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {promo.end_date}
                        </td>
                        <td className="px-6 py-4 flex items-center justify-end gap-4 whitespace-nowrap text-right">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaEdit/>
                          </button>
                          <button className="text-red-600 hover:text-red-900" onClick={()=> handleDelete(promo.id)}>
                            <FaTrash/>
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
        
        {/* Publicités */}
        {activeTab === 'ads' && (
            <div className="space-y-6">
              {/* Formulaire d'ajout de publicité */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Ajouter une publicité</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                        rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]">
                      <option value="banner">Bannière</option>
                      <option value="popup">Popup</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lien
                    </label>
                    <input
                        type="url"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                        placeholder="https://"
                    />
                  </div>
                </div>
                <button className="mt-4 bg-[#048B9A] text-white px-4 py-2 rounded-lg hover:bg-[#037483]">
                  Créer la publicité
                </button>
              </div>
              
              {/* Liste des publicités */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vues
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ads.map((ad) => (
                    <tr key={ad.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">{ad.title}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ad.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ad.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Configuration Firebase */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Configuration Firebase</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Messaging Sender ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                  />
                </div>
              </div>
              <button className="mt-4 bg-[#048B9A] text-white px-4 py-2 rounded-lg hover:bg-[#037483]">
                Sauvegarder la configuration
              </button>
            </div>

            {/* Envoi de notification */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Envoyer une notification</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien (optionnel)
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]"
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cible
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:ring-[#048B9A] focus:border-[#048B9A]">
                    <option value="all">Tous les utilisateurs</option>
                    <option value="subscribers">Abonnés newsletter</option>
                    <option value="customers">Clients existants</option>
                  </select>
                </div>
              </div>
              <button className="mt-4 bg-[#048B9A] text-white px-4 py-2 rounded-lg hover:bg-[#037483]">
                Envoyer la notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingPage; 