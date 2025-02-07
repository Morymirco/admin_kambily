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
      // Afficher un skeleton pendant la vérification de l'authentification
      return (
        <div className="p-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth; 