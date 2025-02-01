"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useLogin} from "../context/LoginContext";

export default function WithAuth(Component) {
	
	return function AuthenticatedComponent(props) {
		const { token } = useLogin();
		const router = useRouter();
		
		useEffect(() => {
			if (!token) {
				router.push('/admin/login'); // Redirige vers la page de connexion si pas de token
			}
		}, [token, router]);
		
		if (!token) {
			return null; // Affiche rien pendant la redirection
		}
		
		return <Component {...props} />;
	};
}
