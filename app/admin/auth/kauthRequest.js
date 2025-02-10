import {HOST_IP, PORT, PROTOCOL_HTTP} from "../constants";

// le request
export const kauthRequest = async (url, options = {}) => {
	let accessToken = localStorage.getItem('access_token');
	const refreshToken = localStorage.getItem('refresh_token');
	
	if (!accessToken || !refreshToken) {
		throw new Error('Authentification requise. Veuillez vous reconnecter.');
	}
	
	// Vérifier si le token est valide
	const isValid = await verifyToken(accessToken);
	if (!isValid) {
		// Si invalide, essayer de rafraîchir le token
		accessToken = await refreshTokenRequest(refreshToken);
		if (!accessToken) {
			throw new Error('Session expirée. Veuillez vous reconnecter.');
		}
	}
	
	// Exécuter la requête avec le token valide
	return fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}${url}`, {
		...options,
		headers: {
			...options.headers,
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});
};

// Vérifier si le token est valide
const verifyToken = async (token) => {
	try {
		const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/api/token/verify/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token }),
		});
		
		return response.ok;
	} catch (error) {
		console.error('Erreur de vérification du token', error);
		return false;
	}
};

// Rafraîchir le token s'il est expiré
const refreshTokenRequest = async (refreshToken) => {
	try {
		const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/api/token/refresh/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh: refreshToken }),
		});
		
		if (response.ok) {
			const data = await response.json();
			localStorage.setItem('access_token', data.access);
			return data.access;
		}
	} catch (error) {
		console.error('Erreur de rafraîchissement du token', error);
	}
	
	return null;
};
