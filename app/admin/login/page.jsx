'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaLock } from 'react-icons/fa';
import {HOST_IP, PORT, PROTOCOL_HTTP} from "../../constants";


const AdminLogin = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError('');
    // setIsLoading(true);

    try {
      console.log(data)
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const url = `${PROTOCOL_HTTP}://${HOST_IP}${PORT}/accounts/login/`
      const meta = {
        method : 'POST',
        body: formData,
      }

      fetch(url, meta)
      .then(response => response.json())
      .then(data => {
        console.log('Réponse du serveur:', data);
        localStorage.setItem('refresh', )
      })
      .catch(error => {
        console.error('Erreur lors de la requête:', error);
      });
      // Simuler une connexion
      // await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Rediriger vers le dashboard
      // router.push('/admin');
    } catch (err) {
      setError('Identifiants incorrects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Image
            src="/logo.webp"
            alt="Kambily Logo"
            width={150}
            height={50}
            className="mb-6"
          />
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre espace administrateur
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={data.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
                placeholder="admin@kambily.com"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={data.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#048B9A] focus:ring-[#048B9A] border-gray-300 rounded"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a 
                  href="#" 
                  className="font-medium text-[#048B9A] hover:text-[#037483]"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#048B9A] hover:bg-[#037483] focus:outline-none transition-colors ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <FaLock />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-[#048B9A] hover:text-[#037483]">
            conditions d'utilisation
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin; 