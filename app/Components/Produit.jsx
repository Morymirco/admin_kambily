'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FaChevronLeft, FaChevronRight,
  FaEye,
  FaFacebookF,
  FaLink,
  FaShoppingCart, FaTimes,
  FaTwitter, FaWhatsapp
} from 'react-icons/fa';

const Spinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#048B9A]"></div>
  </div>
);

const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0].clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentX = e.clientX || e.touches?.[0].clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) { // Seuil minimum pour changer d'image
      if (diff > 0) {
        // Glissement vers la gauche -> image suivante
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        // Glissement vers la droite -> image précédente
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('touchstart', handleDragStart);
    carousel.addEventListener('touchmove', handleDragMove);
    carousel.addEventListener('touchend', handleDragEnd);

    return () => {
      carousel.removeEventListener('touchstart', handleDragStart);
      carousel.removeEventListener('touchmove', handleDragMove);
      carousel.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, startX]);

  return (
    <div 
      ref={carouselRef}
      className="relative h-full w-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <Image
        src={images[currentIndex]}
        alt={`${title} - ${currentIndex + 1}`}
        fill
        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
          isDragging ? 'scale-[0.98]' : ''
        }`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        draggable="false"
      />
      
      {/* Indicateurs en points */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              currentIndex === index 
                ? 'bg-white w-3' 
                : 'bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Zones de détection pour le hover */}
      <div 
        className="absolute left-0 top-0 h-full w-1/2 opacity-0"
        onMouseEnter={() => !isDragging && setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
      />
      <div 
        className="absolute right-0 top-0 h-full w-1/2 opacity-0"
        onMouseEnter={() => !isDragging && setCurrentIndex(prev => (prev + 1) % images.length)}
      />
    </div>
  );
};

const Produit = ({ image, gallery = [], title, price, inStock, category }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const hasGallery = gallery && gallery.length > 0;
  const allImages = hasGallery ? [image, ...gallery] : [image];
  const [copySuccess, setCopySuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpenModal = () => {
    setIsLoading(true);
    setSelectedImage(0);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 500);
  };

  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${title} ${shareUrl}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy URL');
        }
        break;
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <>
      <div className="border rounded-xl overflow-hidden bg-white group">
        {/* Image principale avec carousel si galerie existe */}
        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl">
          {hasGallery ? (
            <ImageCarousel images={allImages} title={title} />
          ) : (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div 
            onClick={handleOpenModal}
            className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-gray-100 z-10"
          >
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

          {/* Bouton Ajouter au panier */}
          <button className="w-full bg-[#048B9A] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaShoppingCart className="text-sm" />
            Ajouter
          </button>
        </div>
      </div>

      {isLoading && <Spinner />}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all z-10 group"
            >
              <FaTimes className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Section image principale et miniatures */}
              <div className="space-y-4">
                {/* Image principale plus grande */}
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src={allImages[selectedImage]}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  {hasGallery && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                      >
                        <FaChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => (prev + 1) % allImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                      >
                        <FaChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Miniatures plus grandes */}
                {hasGallery && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                          selectedImage === index 
                            ? 'ring-2 ring-[#12B886] opacity-100' 
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${title} - vue ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section détails */}
              <div className="space-y-6">
                {/* Titre */}
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                
                {/* Stock */}
                {inStock && (
                  <div className="flex items-center text-green-600">
                    <svg 
                      className="w-4 h-4 mr-2" 
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
                    <span>En stock</span>
                  </div>
                )}

                {/* Prix */}
                <p className="text-3xl font-bold">{price}GNF</p>

                {/* Groupe Quantité + Ajouter au panier */}
                <div className="flex items-center gap-4">
                  {/* Sélecteur de quantité */}
                  <div className="flex items-center border rounded-lg h-12">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      className="px-3 h-full text-gray-600 hover:text-[#12B886] disabled:opacity-50 disabled:cursor-not-allowed border-r"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      className="px-3 h-full text-gray-600 hover:text-[#12B886] border-l"
                    >
                      +
                    </button>
                  </div>

                  {/* Bouton d'action avec largeur réduite */}
                  <button className="w-[200px] bg-[#12B886] text-white h-12 rounded-lg flex items-center justify-center gap-2 hover:bg-[#0CA678] transition-colors">
                    <FaShoppingCart />
                    Ajouter au panier
                  </button>
                </div>

                {/* Tailles */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Tailles disponibles</h3>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button 
                        key={size}
                        className="w-10 h-10 border rounded-md flex items-center justify-center hover:border-[#12B886] hover:text-[#12B886]"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catégorie - côte à côte */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Catégorie:</h3>
                    <div className="text-gray-600">
                      {category}
                    </div>
                  </div>
                </div>

                {/* Partage */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Partager</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                    >
                      <FaFacebookF />
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600"
                    >
                      <FaTwitter />
                    </button>
                    <button 
                      onClick={() => handleShare('whatsapp')}
                      className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
                    >
                      <FaWhatsapp />
                    </button>
                    <button 
                      onClick={() => handleShare('copy')}
                      className="w-9 h-9 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 relative"
                    >
                      <FaLink />
                      {copySuccess && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                          Copié !
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Exemple d'utilisation avec les données des produits
const ProductList = () => {
  const products = [
    {
      id: 1,
      image: "/pyjama.png",
      gallery: ["/bodysuit.png", "/couple_denim.webp"],
      title: "Ensemble De Pyjama Short & Top À Fines Brides Imprimé Cœur",
      price: "65,000",
      category: "Vêtements de nuit",
      key: "pyjama-ensemble-coeur",
      inStock: true
    },
    {
      id: 2,
      image: "/tshirt.png",
      gallery: ["/tshirt2.webp", "/tshirt.png"],
      title: "T-shirt graphique Floral et Slogan pour hommes",
      price: "100,000",
      category: "T-shirts",
      key: "tshirt-floral-homme",
      inStock: true
    },
    {
      id: 3,
      image: "/tshirt2.webp",
      title: "Manfinity Sporsity Homme T-shirt graphique rayé et lettre",
      price: "100,000",
      category: "T-shirts",
      key: "tshirt-raye-manfinity",
      inStock: true
    },
    {
      id: 4,
      image: "/couple_denim.webp",
      title: "Solid V Bra Bodysuit",
      price: "85,000",
      category: "Ensembles",
      key: "ensemble-denim-couple",
      inStock: true
    },
    {
      id: 5,
      image: "/robe_velours.png",
      title: "Robe moulante à fines brides en velours",
      price: "75,000",
      category: "Robes",
      key: "robe-velours-moulante",
      inStock: true
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-16 my-8">
      <div className="flex items-center justify-between border rounded-lg p-4 mb-8">
        <div className="flex items-center gap-8">
          <h2 className="text-xl font-semibold">Livraison Gratuite</h2>
          <div className="bg-[#048B9A] text-white px-4 py-2 rounded">
            00 : 00 : 00 : 00
          </div>
          <p className="text-gray-500">Achetez maintenant et profitez de l'offre !</p>
        </div>
        <Link href="/boutique">  <button className="flex items-center text-[#048B9A]">
         
          Voir Plus
         
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {products.map((product) => (
          <Produit
            key={product.key}
            image={product.image}
            gallery={product.gallery}
            title={product.title}
            price={product.price}
            category={product.category}
            inStock={product.inStock}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
