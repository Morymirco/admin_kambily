'use client'
import { useFavorites } from '@/app/providers/FavoritesProvider';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FaChevronLeft, FaChevronRight,
  FaEye,
  FaFacebookF,
  FaHeart,
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

const Produit = ({ 
  id,
  image, 
  gallery = [], 
  title, 
  price, 
  oldPrice, 
  inStock, 
  category,
  onAddToCart,
  isAddingToCart = false
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const hasGallery = gallery && gallery.length > 0;
  const allImages = hasGallery ? [image, ...gallery] : [image];
  const [copySuccess, setCopySuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showFavToast, setShowFavToast] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(id);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && !isAddingToCart) {
      onAddToCart();
    }
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
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
        <div className="relative h-[190px] w-full overflow-hidden rounded-2xl">
          <Link href={`/boutique/${id}`}>
            {hasGallery ? (
              <ImageCarousel images={allImages} title={title} />
            ) : (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}

            {/* Badge promo */}
            {oldPrice && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                Promo
              </div>
            )}
          </Link>

          {/* Boutons d'action superposés */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {/* Bouton favoris */}
            <motion.button
              onClick={handleFavoriteClick}
              disabled={isTogglingFavorite}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isFavorite(id) 
                  ? 'bg-red-50 hover:bg-red-100' 
                  : 'bg-white hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isTogglingFavorite ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaHeart 
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    isFavorite(id) ? 'text-red-500' : 'text-gray-600'
                  }`}
                />
              )}
            </motion.button>

            {/* Bouton œil */}
            <motion.button 
              onClick={handleOpenModal}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEye className="w-3.5 h-3.5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Informations du produit */}
        <div className="p-4">
          {/* Titre cliquable avec l'ID du produit */}
          <Link href={`/boutique/${id}`}>
            <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 hover:text-[#048B9A] transition-colors cursor-pointer">
              {title}
            </h3>
          </Link>

          {/* Prix avec gestion de la promo */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-lg font-bold text-gray-900">
              {price} GNF
            </p>
            {oldPrice && (
              <p className="text-sm text-gray-500 line-through">
                {oldPrice} GNF
              </p>
            )}
          </div>

          {/* Indicateur de stock */}
          {inStock && (
            <div className="flex items-center text-green-600 mb-3">
              <div className="relative w-4 h-4 flex-shrink-0">
                <Image 
                  src="/box.svg"
                  alt="En stock"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm ml-1.5">En stock</span>
            </div>
          )}

          {/* Bouton Ajouter au panier avec état de chargement */}
          <motion.button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full bg-[#048B9A] text-white px-4 py-2 rounded-lg 
              flex items-center justify-center gap-2 
              md:opacity-0 md:group-hover:opacity-100 transition-all duration-300
              ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#037483]'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-[14px]">Ajout en cours...</span>
              </>
            ) : (
              <>
                <FaShoppingCart className="text-[14px]" />
                <span className="text-[14px]">Ajouter</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black bg-opacity-50 overflow-y-auto md:overflow-hidden">
          <div className="bg-white rounded-lg w-full max-w-5xl relative my-4 mx-2 md:m-0">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all z-10 group"
            >
              <FaTimes className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
              {/* Section image */}
              <div className="space-y-3 md:space-y-4">
                {/* Image principale plus grande */}
                <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
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

                {/* Miniatures avec scroll horizontal sur mobile */}
                {hasGallery && (
                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-none md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100">
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

              {/* Section informations avec scroll sur mobile */}
              <div className="space-y-4 md:space-y-6 overflow-y-auto max-h-[60vh] md:max-h-none">
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
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-bold text-[#048B9A]">
                    {price}GNF
                  </span>
                  {oldPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {oldPrice}GNF
                    </span>
                  )}
                </div>

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
                    Ajouter
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

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-20 sm:bottom-4 right-4 z-[10000] animate-slide-up">
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

      {/* Toast notification pour les favoris */}
      <AnimatePresence>
        {showFavToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 sm:bottom-4 right-4 z-[10000]"
          >
            <div className="bg-white border rounded-lg shadow-lg p-4 flex items-center gap-4">
              {/* Image du produit */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Titre du produit */}
                <p className="text-gray-600 text-sm mb-1.5 line-clamp-2">
                  {title}
                </p>

                <div className="flex items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isFavorite(id) ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <FaHeart className={`w-4 h-4 ${
                      isFavorite(id) ? 'text-red-500' : 'text-gray-600'
                    }`} />
                  </div>
                  <p className="text-sm font-medium">
                    {isFavorite(id) 
                      ? 'Ajouté aux favoris' 
                      : 'Retiré des favoris'
                    }
                  </p>
                </div>
                <Link href="/favoris">
                  <button className="text-[#048B9A] text-sm hover:text-[#037483] transition-colors mt-1">
                    Voir mes favoris
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Produit; 