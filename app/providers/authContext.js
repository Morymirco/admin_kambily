'use client'
import { useState, createContext, useContext } from "react";

const AdminContext = createContext();

function Landing({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [refresh, setRefresh] = useState(null);
	
	return (
		<AdminContext.Provider value={{ user, setUser, token, setToken, refresh, setRefresh }}>
			{children}
		</AdminContext.Provider>
	);
}

export function useAdmin() {
	return useContext(AdminContext);
}

export default Landing;
