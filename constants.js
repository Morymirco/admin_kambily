// Fichier de configuration avec les variables globales

const HOST_DNS = 'api.kambily.store';

const PROTOCOL_HTTPS = 'https';
const PROTOCOL_WS = 'ws';
const PROTOCOL_WSS = 'wss';

// export const HOST_IP = '127.0.0.1';
export const HOST_IP = HOST_DNS;
// export const PORT = ':8001';
export const PORT = '';
// export const PROTOCOL_HTTP = 'http';
export const PROTOCOL_HTTP = PROTOCOL_HTTPS;

export const generateSlug = (name) => {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Enlever les caractères spéciaux
		.replace(/\s+/g, '-') // Remplacer les espaces par des tirets
		.replace(/-+/g, '-'); // Éviter les tirets multiples
};

export const formatNumber = (number) => {
	// Vérifier si le nombre est un nombre valide
	if (isNaN(number)) return number;
	
	// Formater le nombre avec un séparateur de milliers et un point comme séparateur décimal
	const formattedNumber = number.toLocaleString('en-US', {
		minimumFractionDigits: 2,  // Pour garantir au moins 2 décimales (par exemple: 123,000.00)
		maximumFractionDigits: 3,  // Pour ne pas avoir plus de 3 décimales
	});
	
	// Ajouter l'unité monétaire (GNF) à la fin
	return `${formattedNumber} GNF`;
}

export const isTokenValid = async () => {
	const token = localStorage.getItem('refresh'); // Récupère le token depuis le localStorage
	
	if (!token) {
		return false;
	}
	
	try {
		// Envoie une requête vers l'endpoint de validation du token
		const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/api/token/refresh/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
			},
			body: JSON.stringify({ refresh: token }),
		});
		
		const data = await response.json();
		console.log('data', data);
		return !!data;
	} catch (error) {
		console.error('Erreur lors de la vérification du token:', error);
		return false; // En cas d'erreur, retourner false (token invalide ou erreur serveur)
	}
}

export const IsAuthenticated = async () => {
	return isTokenValid()
}

export const generateSKU = (product) =>{
	const { name } = product;
	
	// Extraire les premières lettres des mots du nom et de la catégorie
	const namePart = name.split(" ")[0].substring(0, 3)
	
	const date = new Date()
	const date_ajout = `${date.getDay() + 1}-${date.getMonth() + 1}-${date.getFullYear()}`
	
	// Combiner les parties pour former le SKU
	return `${namePart}-${date_ajout}`.toUpperCase();
}

export const STOCK_STATUS = ['En Stock', 'Rupture de stock', 'Sur commande']

export const PRODUCT_TYPE = ['simple', 'variable']