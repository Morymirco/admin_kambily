'use client'
import {createContext, useState, useContext, useEffect} from 'react';
import {HOST_IP, PORT, PROTOCOL_HTTP} from "@/constants";

// Créer le contexte
const LoginContext = createContext(null);

// Créer un provider pour gérer l'état
export default function LoginProvider({ children }){
	const [token, setToken] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [user, setUser] = useState(null);
	
	const changeToken = (newToken) => {
		setToken(newToken);
	}
	
	const changeRefresh = (newRefresh) => {
		setRefresh(newRefresh);
	}
	
	const changeUser = (newUser) => {
		setUser(newUser);
	}
	
	// Vérifier si un token valide existe au chargement
	useEffect(() => {
		const storedToken = localStorage.getItem('accessToken');
		const storedRefresh = localStorage.getItem('refreshToken');
		const storedUser = localStorage.getItem('user');
		
		if (storedToken && storedRefresh) {
			// Vérifier si le token est valide
			checkTokenValidity(storedToken).then((isValid) => {
				if (isValid) {
					setToken(storedToken);
					setRefresh(storedRefresh);
					setUser(JSON.parse(storedUser));
				} else {
					logout(); // Si le token est expiré, on déconnecte
				}
			});
		}
	}, []);
	
	const logout = () => {
		setToken(null);
		setRefresh(null);
		setUser(null);
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('user');
	}
	
	// Fonction pour vérifier si le token est valide
	const checkTokenValidity = async (token) => {
		try {
			const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/api/token/verify/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});
			
			return response.ok; // Retourne true si valide, false sinon
		} catch (error) {
			console.error("Erreur de vérification du token :", error);
			return false;
		}
	};
	
	return (
		<LoginContext.Provider value={{ token, changeToken, refresh, changeRefresh, user, changeUser }}>
			{children}
		</LoginContext.Provider>
	);
};

// Créer un hook personnalisé pour accéder au contexte
export const useLogin = () => useContext(LoginContext);
