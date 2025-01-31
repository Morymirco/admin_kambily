import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

// Composant pour les cartes de produits
const ProductCard = ({ image, title, price, inStock }) => {
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden relative">
      {/* Image Container */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Boutons flottants */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
            <FaEye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-[#048B9A] transition-colors">
          {title}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-2">{price}GNF</p>
        
        {inStock && (
          <div className="flex items-center text-[#048B9A] mb-3">
            <svg 
              className="w-4 h-4 mr-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 8l-2-2H5L3 8h18z" />
              <path d="M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8" />
              <path d="M12 12v6" />
              <path d="M12 12l4-4" />
              <path d="M12 12l-4-4" />
            </svg>
            <span className="text-sm">In Stock</span>
          </div>
        )}

        {/* Bouton Ajouter au panier */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-[#048B9A] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {isAddingToCart ? (
            <>
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span className="ml-2">Ajout...</span>
            </>
          ) : (
            <>
              <FaShoppingCart className="w-3.5 h-3.5" />
              <span className="text-xs">Ajouter au panier</span>
            </>
          )}
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-white border rounded-lg shadow-lg p-4 w-[300px] flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ajouté au panier
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1 truncate">{title}</p>
              <Link href="/panier">
                <button className="mt-2 text-[#048B9A] text-sm font-medium hover:text-[#037383] transition-colors">
                  Voir le panier
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Collection = () => {
  const jewelryProducts = [
    {
        id: 1,
        image: "/pyjama.png",
        title: "Ensemble De Pyjama Short & Top À Fines Brides Imprimé Cœur",
        price: "65,000",
        inStock: true
      },
      {
        id: 2,
        image: "/tshirt.png",
        title: "T-shirt graphique Floral et Slogan pour hommes",
        price: "100,000",
        inStock: true
      },
      {
        id: 3,
        image: "/tshirt2.webp",
        title: "Manfinity Sporsity Homme T-shirt graphique rayé et lettre",
        price: "100,000",
        inStock: true
      },
  ];

  const electronicProducts = [
    {
      id: 1,
      image: "/realite.webp",
      title: "Réalité Virtuelle Casque , Portable 3D Virtuel Réalité Lunettes Pour Films Et Jeux",
      price: "185,000",
      oldPrice: "210,000",
      inStock: true,
      description: "Profitez dès maintenant avant la fin de l'offre"
    },
    {
      id: 2,
      image: "/pochette.webp",
      title: "Coque De Téléphone Portable Figure",
      price: "45,000",
      inStock: true
    },
    {
      id: 3,
      image: "/lumiere.webp",
      title: "1 pièce Lumière d'ambiance pour téléphone clip rond avec miroir",
      price: "40,000",
      inStock: true
    },
    {
      id: 4,
      image: "/lunettes.webp",
      title: "3 Pièces Lunettes De Soleil De Mode",
      price: "85,000",
      oldPrice: "100,000",
      inStock: true,
      description: "Ne manquez pas cette opportunité tant qu'elle dure"
    },
    {
      id: 5,
      image: "/souris.webp",
      title: "Souris sans fil silencieuse à lumière RVB, souris de jeu",
      price: "52,000",
      inStock: true
    },
    {
      id: 6,
      image: "/cheveux.webp",
      title: "Ensemble De 100 Petits Liens Pour Cheveux Minimalistes",
      price: "15,000",
      inStock: true
    },
    {
      id: 7,
      image: "/porte.webp",
      title: "Portefeuille Slimfold À Capacité Supplémentaire",
      price: "45,000",
      inStock: true
    },
    {
      id: 8,
      image: "/casque.webp",
      title: "1 pièce Chapeau De Camionneur Pays À Lettres",
      price: "25,000",
      oldPrice: "45,000",
      inStock: true
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-16 my-8">
      {/* Section Bijouterie */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Produits bijouterie - 50% */}
        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jewelryProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        </div>

        {/* Banner Bijouterie */}
        <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden group">
          <div className="absolute inset-0">
            <Image
              src="/chaine.jpg"
              alt="Collection de bijoux"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 group-hover:opacity-70" />
          </div>

          {/* Contenu aligné à gauche */}
          <div className="relative h-full p-6 flex flex-col gap-2 z-10">
            <span className="bg-[#048B9A] text-white px-4 py-1 mt-4 rounded-full text-sm uppercase w-fit">
              Bijouterie
            </span>

            <div className="text-white transform transition-transform duration-300 group-hover:translate-y-[-8px] max-w-[80%]">
              <h2 className="text-2xl font-bold mb-3 text-left">
                Éblouissez-vous avec notre collection de bijoux
              </h2>
              <p className="text-gray-200 mb-4 text-left">
                Parcourez notre collection pour trouver des bijoux qui parlent de votre style unique.
              </p>
              <Link 
                href="/explorer"
                className="text-white flex items-center gap-2 hover:gap-3 transition-all duration-300 w-fit"
              >
                Explorer
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Électronique */}
      <div className="mt-12">
        {/* Bannière électronique */}
        <div className="relative h-[271.25px] rounded-2xl overflow-hidden bg-black mb-8 group">
          <div className="absolute inset-0">
            <Image
              src="/iphone.jpg"
              alt="Électronique"
              fill
              className="object-cover object-right transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
          </div>
          <div className="relative h-full p-8 flex flex-col gap-3 z-10 max-w-lg transform transition-transform duration-300 group-hover:translate-y-[-8px]">
            <span className="bg-[#048B9A] text-white px-4 py-1 mt-4 rounded-full text-sm uppercase w-fit">
              Électronique
            </span>
            <div className="text-left max-w-[80%]">
              <h2 className="text-3xl font-bold text-white mb-3">
                Vivez la Révolution High-Tech
              </h2>
              <p className="text-gray-200 mb-4 text-sm">
                Découvrez notre sélection d'électronique de pointe !
              </p>
              <Link 
                href="/explorer"
                className="text-white flex items-center gap-2 hover:gap-3 transition-all duration-300 w-fit"
              >
                Explorer
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Grille de produits électroniques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {electronicProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-[200px]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm text-gray-800 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price}GNF
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.oldPrice}GNF
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-2">
                    {product.description}
                  </p>
                )}
                {product.inStock && (
                  <div className="flex items-center text-[#048B9A]">
                    <svg 
                      className="w-4 h-4 mr-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 8l-2-2H5L3 8h18z" />
                      <path d="M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8" />
                      <path d="M12 12v6" />
                      <path d="M12 12l4-4" />
                      <path d="M12 12l-4-4" />
                    </svg>
                    <span className="text-sm">In Stock</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
