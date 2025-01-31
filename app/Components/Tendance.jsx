import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ image, title, price, inStock }) => {
  return (
    <div className="border rounded-xl overflow-hidden bg-white group">
      {/* Image principale */}
      <div className="relative h-[220px] w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-gray-100 z-10">
          <FaEye className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Informations du produit */}
      <div className="p-4">
        {/* Titre */}
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Prix */}
        <p className="text-lg font-bold text-gray-900 mb-2">
          {price}GNF
        </p>

        {/* Indicateur de stock */}
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

        {/* Bouton Ajouter au panier avec texte plus petit */}
        <button className="w-full bg-[#048B9A] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaShoppingCart className="w-3.5 h-3.5" />
          <span className="text-xs">Ajouter au panier</span>
        </button>
      </div>
    </div>
  );
};

const Tendance = () => {
  const trendingProducts = [
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
      {
        id: 4,
        image: "/couple_denim.webp",
        title: "Solid V Bra Bodysuit",
        price: "85,000",
        inStock: true
      },
      {
        id: 5,
        image: "/robe_velours.png",
        title: "Robe moulante à fines brides en velours",
        price: "75,000",
        inStock: true
      }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-16 my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section Tendance avec effet de zoom */}
        <div className="relative h-[800px] rounded-2xl overflow-hidden bg-gray-100 group">
          {/* Badge Vêtements */}
          <div className="absolute top-8 left-8 z-10">
            <span className="bg-[#048B9A] text-white px-4 py-1 rounded-full text-sm uppercase">
              Vêtements
            </span>
          </div>

          {/* Texte */}
          <div className="absolute top-24 left-8 z-10 max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">
              Des Tendances qui Captivent
            </h2>
            <p className="text-gray-200 mb-6">
              Explorez notre gamme de vêtements inspirés des dernières tendances de la mode mondiale.
            </p>
            <Link 
              href="/explorer" 
              className="text-[#048B9A] flex items-center gap-2 hover:gap-3 transition-all duration-300"
            >
              Explorer
              <svg 
                className="w-4 h-4" 
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

          {/* Image avec effet de zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/couple_denim.webp"
              alt="Couple en denim"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        </div>

        {/* Grille de produits modifiée */}
        <div className="grid grid-rows-2 gap-4">
          {/* Première ligne : 3 produits */}
          <div className="grid grid-cols-3 gap-4">
            {trendingProducts.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                inStock={product.inStock}
              />
            ))}
          </div>
          
          {/* Deuxième ligne : 2 produits centrés */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-start-1 col-end-3 grid grid-cols-2 gap-4">
              {trendingProducts.slice(3, 5).map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                  inStock={product.inStock}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tendance;
