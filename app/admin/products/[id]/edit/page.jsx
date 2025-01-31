'use client'
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { HOST_IP, PORT, PRODUCT_TYPE, PROTOCOL_HTTP, STOCK_STATUS } from "../../../../constants";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    name: 'N/A',
    short_description: 'N/A',
    long_description: 'N/A',
    regular_price: 0,
    promo_price: 0,
    sku: 'N/A',
    stock_status: false,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    product_type: 'N/A',
    etat_stock: 'N/A',
    quantity: 0,
    categories: [],
    colors: [],
    sizes: [],
    etiquettes: [],
    images: [],
    reviews : []
  });
  const [formData, setFormData] = useState(product)
  
  // États pour les listes de sélection
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Charger les données du produit à modifier au chargement
  useEffect(() => {
    const fetchProduct = () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/${params.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(data => {
              setProduct(data);
              setFormData(data);
            })
            .catch(err => {
              console.error('Erreur lors du chargement du produit:', err);
              toast.error('Erreur lors du chargement du produit');
            })
            .finally(() => {
              setLoading(false);
            })
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  // Charger les données de référence au chargement
  useEffect(() => {
    const fetchReferenceData = () => {
      try {
        const token = localStorage.getItem('access_token');
        
        // Charger les catégories
        const categoriesResponse = fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/attributes/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
            .then(response => response.json())
            .then(data => {
              setAvailableCategories(data.categories);
              setAvailableSizes(data.sizes);
              setAvailableColors(data.colors);
              setAvailableTags(data.tags);
            }).catch(err => {
              setError(err.message);
              console.log(err)
            })
            .finally(() => {
              setLoading(false);
            })
      } catch (err) {
        console.error('Erreur lors du chargement des données de référence:', err);
        toast.error('Erreur lors du chargement des attributs');
      }
    };

    fetchReferenceData();
  }, []);

  // Fonction pour gérer le changement d'images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Créer les URLs de prévisualisation
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => {
      // Nettoyer les anciennes URLs
      prev.forEach(url => URL.revokeObjectURL(url));
      return previews;
    });
  };

  // Nettoyer les URLs à la destruction du composant
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('short_description', formData.short_description);
    data.append('long_description', formData.long_description);
    data.append('regular_price', formData.regular_price);
    data.append('promo_price', formData.promo_price);
    data.append('sku', formData.sku);
    data.append('stock_status', formData.stock_status);
    data.append('weight', formData.weight);
    data.append('length', formData.length);
    data.append('width', formData.width);
    data.append('height', formData.height);
    data.append('product_type', formData.product_type);
    data.append('etat_stock', formData.etat_stock);
    data.append('quantity', formData.quantity);
    data.append('categories', `[${formData.categories}]`);
    data.append('sizes', `[${formData.sizes}]`);
    data.append('etiquettes', `[${formData.etiquettes}]`);
    data.append('colors', `[${formData.colors}]`)
    
    // Ajout des images sélectionnées
    selectedImages.forEach((file) => {
      data.append('images', file);
    });
    
    console.log(data)

    try {
        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/update/${params.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: data
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      toast.success('Produit mis à jour avec succès');
      router.push(`/admin/products/${params.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#048B9A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h1 className="text-xl font-bold">Modifier le produit</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Informations de base</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit
              </label>
              <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setFormData ({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData ({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte
              </label>
              <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData ({...formData, short_description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type de produit</label>
              <select
                  value={formData.product_type}
                  onChange={(e) => setFormData ({...formData, product_type: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
              >
                {
                  PRODUCT_TYPE.map(type => (
                      <option
                          key={type} // Ajoute un key pour chaque option
                          value={type}
                      >
                        {type}
                      </option>
                  ))
                  
                }
              </select>
            </div>
            
            <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Description longue
              </label>
              <textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData ({...formData, long_description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={5}
              />
            </div>
          </div>
        </div>
        
        {/* Prix et stock */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Prix et stock</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix régulier
              </label>
              <input
                  type="number"
                  value={formData.regular_price}
                  onChange={(e) => setFormData ({...formData, regular_price: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix promo
              </label>
              <input
                type="number"
                value={formData.promo_price}
                onChange={(e) => setFormData({...formData, promo_price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                État du stock
              </label>
              <select
                value={formData.etat_stock}
                onChange={(e) => setFormData({...formData, etat_stock: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {
                  STOCK_STATUS.map(status => (
                      <option value={status}>{status}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Dimensions</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longueur (cm)
              </label>
              <input
                type="number"
                value={formData.length}
                onChange={(e) => setFormData({...formData, length: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largeur (cm)
              </label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) => setFormData({...formData, width: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hauteur (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Attributs */}
        {/* Catégories, Couleurs, Tailles et Tags */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Attributs du produit</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Catégories */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#048B9A] rounded-full"></span>
                Catégories
              </h3>
              
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {availableCategories.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucune catégorie principale disponible</p>
                ) : (
                    availableCategories.map (category => (
                        <label key={category.id}
                               className="flex items-center p-2 hover:bg-white rounded-md transition-colors">
                          <input
                              type="checkbox"
                              checked={formData.categories.includes (category.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                let updatedCategories;
                                if (isChecked) {
                                  updatedCategories = [...formData.categories, category.id];
                                } else {
                                  updatedCategories = formData.categories.filter ((id) => id !== category.id);
                                }
                                setFormData ({...formData, categories: updatedCategories});
                              }}
                              className="rounded border-gray-300 text-[#048B9A] focus:ring-[#048B9A]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                        </label>
                    ))
                )}
              </div>
            </div>
            
            {/* Couleurs - Visible uniquement si le type est "variable" */}
            {formData.product_type === PRODUCT_TYPE[1] && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#048B9A] rounded-full"></span>
                    Couleurs
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {availableColors.map(color => (
                        <label key={color.id} className="flex items-center p-2 hover:bg-white rounded-md transition-colors">
                          <input
                              type="checkbox"
                              checked={formData.colors.includes(color.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked
                                let updatedColors = [];
                                if (isChecked) {
                                  updatedColors = [...formData.colors, color.id];
                                } else {
                                  updatedColors = formData.colors.filter ((id) => id !== color.id);
                                }
                                setFormData ({...formData, colors: updatedColors});
                              }}
                              className="rounded border-gray-300 text-[#048B9A] focus:ring-[#048B9A]"
                          />
                          <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                          {color.hex_code && (
                              <span
                                  className="w-4 h-4 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color.hex_code }}
                              ></span>
                          )}
                            {color.name}
                        </span>
                        </label>
                    ))}
                  </div>
                </div>
            )}
            
            {/* Tailles - Visible uniquement si le type est "variable" */}
            {formData.product_type === PRODUCT_TYPE[0] && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#048B9A] rounded-full"></span>
                    Tailles
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {availableSizes.map(size => (
                        <label
                            key={size.id}
                            className={`
                          flex items-center justify-center p-2 rounded-md cursor-pointer transition-all
                          ${formData.sizes.includes(size.id)
                                ? 'bg-[#048B9A] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'}
                        `}
                        >
                          <input
                              type="checkbox"
                              checked={formData.sizes.includes (size.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                let updatedSizes;
                                if (isChecked) {
                                  updatedSizes = [...formData.sizes, size.id];
                                } else {
                                  updatedSizes = formData.sizes.filter ((id) => id !== size.id);
                                }
                                setFormData ({...formData, sizes: updatedSizes});
                              }}
                              className="sr-only"
                          />
                          <span className="text-sm font-medium">{size.name}</span>
                        </label>
                    ))}
                  </div>
                </div>
            )}
            
            {/* Tags */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#048B9A] rounded-full"></span>
                Étiquettes
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {availableTags.map(tag => (
                    <label
                        key={tag.id}
                        className={`
                        flex items-center p-2 hover:bg-white rounded-md transition-colors
                        ${formData.etiquettes.includes(tag.id) ? 'bg-white' : ''}
                      `}
                    >
                      <input
                          type="checkbox"
                          checked={formData.etiquettes.includes(tag.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            let updateEtiquettes;
                            if (isChecked) {
                              updateEtiquettes = [...formData.etiquettes, tag.id];
                            } else {
                              updateEtiquettes = formData.etiquettes.filter ((id) => id !== tag.id);
                            }
                            setFormData ({...formData, etiquettes: updateEtiquettes});
                          }}
                          className="rounded border-gray-300 text-[#048B9A] focus:ring-[#048B9A]"
                      />
                      <div className="ml-2">
                        <span className="text-sm text-gray-700">{tag.name}</span>
                        {tag.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{tag.description}</p>
                        )}
                      </div>
                    </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section images */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Images du produit
          </label>
          
          {/* Input file */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#048B9A] file:text-white
              hover:file:bg-[#037483]"
          />

          {/* Prévisualisation des images */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {previewImages.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImages(prev => prev.filter((_, i) => i !== index));
                      setSelectedImages(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#048B9A] text-white rounded-lg flex items-center gap-2"
          >
            <FaSave />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
} 