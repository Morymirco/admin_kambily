'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { PROTOCOL_HTTP, HOST_IP, PORT } from '../../../../constants';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `${PROTOCOL_HTTP}://${HOST_IP}${PORT}/accounts/${id}/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setUser(response.data);
        console.log("response",response.data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la récupération des données utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(
        `${PROTOCOL_HTTP}://${HOST_IP}${PORT}/accounts/admin/delete/${user.email}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Utilisateur supprimé avec succès');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Utilisateur non trouvé</p>
        <button 
          onClick={() => router.push('/admin/users')}
          className="mt-4 text-[#048B9A] hover:underline"
        >
          Retourner à la liste des utilisateurs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Retour aux utilisateurs
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Détails de l'utilisateur
              </h1>
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push(`/admin/users/edit/${id}`)}
                  className="bg-[#048B9A] text-white px-4 py-2 rounded-lg hover:bg-[#037483] flex items-center"
                >
                  <FaEdit className="mr-2" /> Modifier
                </button>
                <button 
                  onClick={handleDelete}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center"
                >
                  <FaTrash className="mr-2" /> Supprimer
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Informations personnelles</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Nom:</span>
                    <span className="ml-2">{user.last_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Prénom:</span>
                    <span className="ml-2">{user.first_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Téléphone:</span>
                    <span className="ml-2">{user.phone || 'Non renseigné'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Adresse</h2>
                <p className="text-gray-700">{user.address || 'Non renseignée'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Statistiques commandes</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Total commandes:</span>
                    <p className="font-medium">{user.orders?.total_orders || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Montant total:</span>
                    <p className="font-medium">{user.orders?.total_prices || 0} GNF</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Moyenne par commande:</span>
                    <p className="font-medium">{user.orders?.average || 0} GNF</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Activité</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Dernière connexion:</span>
                    <p>{new Date(user.last_login).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date d'inscription:</span>
                    <p>{new Date(user.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Statut:</span>
                    <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;