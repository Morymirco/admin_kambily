'use client'
import { HOST_IP, PORT, PROTOCOL_HTTP } from '@/constants';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      const response = await axios.get(
        `${PROTOCOL_HTTP}://${HOST_IP}${PORT}/accounts/getuser/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUser(response.data);
      console.log('Utilisateur authentifié:', response.data);
    } catch (error) {
      console.error('Erreur de vérification auth:', error);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${PROTOCOL_HTTP}://${HOST_IP}${PORT}/accounts/login/`,
        { email, password }
      );

      const { access_token, user: userData } = response.data;
      console.log("response.data", response.data);
      localStorage.setItem('access_token', access_token);
      setUser(userData);
      toast.success('Connexion réussie');
      
      router.push('/admin');
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error(error.response?.data?.message || 'Erreur de connexion');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    router.push('/login');
    toast.success('Déconnexion réussie');
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    logout,
    checkAuth
  };

  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};