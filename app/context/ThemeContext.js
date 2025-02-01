import { createContext, useState, useContext } from 'react';

// Créer le contexte
const ThemeContext = createContext(null);

// Créer un provider pour gérer l'état
export const ThemeProvider = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	
	const toggleTheme = () => {
		setIsDarkMode(prevMode => !prevMode);
	};
	
	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Créer un hook personnalisé pour accéder au contexte
export const useTheme = () => useContext(ThemeContext);
