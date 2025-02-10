import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {HOST_IP, PORT, PROTOCOL_HTTP} from "../constants";

const kwithAuth = (WrappedComponent) => {
	return function ProtectedRoute(props) {
		const router = useRouter();
		const [loading, setLoading] = useState(true);
		
		useEffect(() => {
			const verifyToken = async () => {
				const accessToken = localStorage.getItem('access_token');
				const refreshToken = localStorage.getItem('refresh_token');
				
				if (!accessToken || !refreshToken) {
					await router.push ('/login'); // Redirige vers la page de connexion
					return;
				}
				
				try {
					// Vérifier la validité du token
					const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/api/token/verify/`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ token: accessToken }),
					});
					
					if (response.ok) {
						setLoading(false);
						return;
					}
					
					// Si le token est expiré, tenter de le rafraîchir
					const refreshResponse = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/api/token/refresh/`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ refresh: refreshToken }),
					});
					
					if (refreshResponse.ok) {
						const data = await refreshResponse.json();
						localStorage.setItem('access_token', data.access);
						setLoading(false);
						return;
					}
				} catch (error) {
					console.log (error)
					console.error('Erreur de vérification du token', error);
				}
				
				await router.push ('/login'); // Si tout échoue, rediriger vers login
			};
			
			verifyToken ().then (r  => console.log("after verify token"));
		}, [router]); // S'execute des que la page s'affiche
		
		if (loading) return <p className="text-center">Chargement...</p>;
		
		return <WrappedComponent {...props} />;
	};
};

export default kwithAuth;
