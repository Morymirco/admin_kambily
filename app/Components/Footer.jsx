import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-8 lg:py-10">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Colonne 1 - À propos */}
          <div>
            <h3 className="text-lg font-bold mb-3 sm:mb-4">Trouvez-Cliquez-Achetez</h3>
            <p className="text-gray-400 mb-3">
              Nous sommes bien plus qu'une simple plateforme e-commerce. Nous sommes une équipe passionnée, dédiée à offrir la meilleure expérience d'achat possible à nos clients.
            </p>
            <Link href="/about" className="text-[#048B9A] hover:text-[#048B9A]/80">
              À propos – Kambily
            </Link>
          </div>

          {/* Colonne 2 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3 sm:mb-4">Besoin d'aide?</h3>
            <div className="text-gray-400">
              <p className="text-xl font-bold text-white mb-2 sm:mb-3">(+224) 624 00 00 00</p>
              <p className="mb-1">Lundi – Vendredi: 9:00-20:00</p>
              <p className="mb-2 sm:mb-3">Samedi: 10:00 – 15:00</p>
              <a href="mailto:contact@kambily.com" className="text-[#048B9A] hover:text-[#048B9A]/80">
                contact@kambily.com
              </a>
            </div>
          </div>

          {/* Colonne 3 - Service client avec icônes */}
          <div>
            <h3 className="text-xl font-bold mb-6">Service client</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link href="/aide" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg 
                    className="w-5 h-5 text-[#048B9A] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Aide
                </Link>
              </li>
              <li>
                <Link href="/profile" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg 
                    className="w-5 h-5 text-[#048B9A] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Mon compte
                </Link>
              </li>
              <li>
                <Link href="/commandes" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg 
                    className="w-5 h-5 text-[#048B9A] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
                    <path d="M16.5 9.4L7.55 4.24"/>
                    <polyline points="3.29 7 12 12 20.71 7"/>
                    <line x1="12" y1="22" x2="12" y2="12"/>
                  </svg>
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <Link href="/favoris" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <svg 
                    className="w-5 h-5 text-[#048B9A] group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Mes favoris
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Slogan */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Votre boutique en ligne préférée.
            </h3>
          </div>
        </div>

        {/* Bannière promotionnelle */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-b border-gray-700 text-center">
          <div className="py-3 px-4 border-r border-gray-700">
            Profitez de tous nos produits en promo maintenant
          </div>
          <div className="py-3 px-4">
            Livraison gratuite pour toute commande de plus de 350.000GNF
          </div>
        </div>

        {/* Pied de page */}
        <div className="pt-6 mt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Liens légaux avec navigation Next.js */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <Link 
                href="/confidentialite" 
                className="hover:text-white transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link 
                href="/conditions" 
                className="hover:text-white transition-colors"
              >
                Termes et conditions de vente
              </Link>
              <Link 
                href="/retour" 
                className="hover:text-white transition-colors"
              >
                Politique de retour
              </Link>
              <Link 
                href="/cookies" 
                className="hover:text-white transition-colors"
              >
                Politique de cookies (Guinée)
              </Link>
            </div>

            {/* Méthodes de paiement */}
            <div className="flex gap-2">
              <Image src="/paiements/om.png" alt="Orange Money" width={40} height={24}  className='bg-white object-contain'/>
              <Image src="/paiements/momo.png" alt="MTN" width={40} height={24}  className='bg-white object-contain '/>
              <Image src="/paiements/paycard.png" alt="Apple Pay" width={40} height={24} className='bg-white object-contain p-1'/>
              <Image src="/paiements/paypal.png" alt="PayPal" width={40} height={24} className='bg-white object-contain'/>
              <Image src="/paiements/visa.png" alt="Visa" width={40} height={24} className='bg-white object-contain'/>
              <Image src="/paiements/mastercard.png" alt="Mastercard" width={40} height={24} className='bg-white object-contain'/>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm mt-6">
            Copyright 2024 © Kambily Sarl. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
