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
      return <p>Chargement...</p>; // Vous pouvez personnaliser ce message
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth; 