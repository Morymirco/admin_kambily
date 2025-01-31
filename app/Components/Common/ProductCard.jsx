'use client'
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEye, FaFacebookF, FaHeart, FaLink, FaShoppingCart, FaTimes, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const ProductCard = ({ image, gallery = [], title, price, oldPrice, inStock, description, isFavorite: initialFavorite = false, onRemoveFavorite, isRemoving }) => {
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [showFavToast, setShowFavToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const images = [image, ...(gallery || [])];

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${url}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setShowFavToast(true);
    setTimeout(() => setShowFavToast(false), 2000);
  };

  return (
    <>
      <div className="group bg-white rounded-xl overflow-hidden relative">
        {/* Image Container */}
        <div className="relative h-[200px] w-full overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay au survol */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Indicateur du nombre d'images */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}

          {/* Badge promo */}
          {oldPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
              Promo
            </div>
          )}

          {/* Boutons de navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
              >
                <FaChevronLeft className="w-3 h-3 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
              >
                <FaChevronRight className="w-3 h-3 text-gray-800" />
              </button>
            </>
          )}

          {/* Bouton œil */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => setShowModal(true)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <FaEye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-[#048B9A] transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <p className="text-lg font-bold text-gray-900">{price}GNF</p>
            {oldPrice && (
              <p className="text-sm text-gray-500 line-through">{oldPrice}GNF</p>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-500 mb-2">{description}</p>
          )}
          
          {inStock && (
            <div className="flex items-center text-green-600 mb-3">
              <div className="relative w-4 h-4 flex-shrink-0 [&_svg]:text-green-600 [&_path]:fill-green-600">
                <Image 
                  src="/box.svg"
                  alt="En stock"
                  fill
                  className="object-contain text-green-600"
                />
              </div>
              <span className="text-sm ml-1.5">En stock</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {/* Bouton Favoris - Modifié pour apparaître au survol */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isFavorite && onRemoveFavorite) {
                  try {
                    await onRemoveFavorite();
                    setIsFavorite(false);
                    setShowFavToast(true);
                    setTimeout(() => setShowFavToast(false), 2000);
                  } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                  }
                } else {
                  handleFavorite(e);
                }
              }}
              disabled={isRemoving}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 ${
                isFavorite 
                  ? 'bg-red-50 hover:bg-red-100' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${isRemoving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <FaHeart 
                className={`w-4 h-4 transition-colors duration-300 ${
                  isFavorite ? 'text-red-500' : 'text-gray-600'
                } ${isRemoving ? 'animate-pulse' : ''}`}
              />
            </button>

            {/* Bouton Ajouter au panier */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-[#048B9A] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
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
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black bg-opacity-50 overflow-y-auto md:overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-5xl relative my-4 mx-2 md:m-0"
            >
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
                      src={images[selectedImage]}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                        >
                          <FaChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                        >
                          <FaChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Miniatures avec scroll horizontal sur mobile */}
                  {images.length > 1 && (
                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-none md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100">
                      {images.map((img, index) => (
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
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                  
                  {/* Stock */}
                  {inStock && (
                    <div className="flex items-center text-green-600">
                      <div className="relative w-4 h-4 flex-shrink-0 [&_svg]:text-green-600 [&_path]:fill-green-600 mr-2">
                        <Image 
                          src="/box.svg"
                          alt="En stock"
                          fill
                          className="object-contain text-green-600"
                        />
                      </div>
                      <span>En stock</span>
                    </div>
                  )}

                  {/* Prix */}
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#048B9A]">
                      {price}GNF
                    </span>
                    {oldPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {oldPrice}GNF
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="text-gray-600">{description}</p>
                  )}

                  {/* Groupe Quantité + Ajouter au panier */}
                  <div className="flex items-center gap-4">
                    {/* Sélecteur de quantité */}
                    <div className="flex items-center border rounded-lg h-12">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 h-full text-gray-600 hover:text-[#12B886] disabled:opacity-50 disabled:cursor-not-allowed border-r"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 h-full text-gray-600 hover:text-[#12B886] border-l"
                      >
                        +
                      </button>
                    </div>

                    {/* Bouton Ajouter au panier */}
                    <button 
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="w-[200px] bg-[#048B9A] text-white h-12 rounded-lg flex items-center justify-center gap-2 hover:bg-[#037483] transition-colors"
                    >
                      {isAddingToCart ? (
                        <>
                          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Ajout...</span>
                        </>
                      ) : (
                        <>
                          <FaShoppingCart />
                          Ajouter au panier
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tailles */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Tailles disponibles</h3>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button 
                          key={size}
                          className="w-10 h-10 border rounded-md flex items-center justify-center hover:border-[#048B9A] hover:text-[#048B9A]"
                        >
                          {size}
                        </button>
                      ))}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    isFavorite ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <FaHeart className={`w-4 h-4 ${
                      isFavorite ? 'text-red-500' : 'text-gray-600'
                    }`} />
                  </div>
                  <p className="text-sm font-medium">
                    {isFavorite 
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

export default ProductCard; 