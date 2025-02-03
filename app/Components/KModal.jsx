import { useEffect } from "react";
import Loader from "./Loader";

const KModal = ({ isOpen, onClose, title = "Suppression en cours" }) => {
	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		} else {
			document.removeEventListener("keydown", handleEscape);
		}
		
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);
	
	if (!isOpen) return null;
	
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
				<h2 className="text-xl font-bold mb-4">{title}</h2>
				<Loader/>
				{/*<button*/}
				{/*	onClick={onClose}*/}
				{/*	className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"*/}
				{/*>*/}
				{/*	Fermer*/}
				{/*</button>*/}
			</div>
		</div>
	);
};

export default KModal;
