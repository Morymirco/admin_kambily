'use client'
import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const WithAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading, initialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && initialized && !user) {
        router.push('/login');
      }
    }, [loading, initialized, user, router]);

    if (loading || !initialized) {
      // Afficher un indicateur de chargement pendant la vérification de l'authentification
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth; 