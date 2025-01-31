"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { generateSKU } from './../../../constants';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_description: '',
    regular_price: 0,
    promo_price: 0,
    sku: '',
    stock_status: true,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    product_type: 'variable',
    etat_stock: 'En Stock',
    quantity: 0,
    categories: [],
    colors: [],
    sizes: [],
    etiquettes: [],
    images: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const ref = useRef(null)
  
  const router = useRouter();
  
  // Modifier useEffect pour enlever l'appel à websocketManagement
  useEffect(() => {
    // Avant la déconnexion ou avant de rediriger l'utilisateur
    const currentRoute = window.location.pathname;  
    localStorage.setItem('redirectRoute', currentRoute);  
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    localStorage.setItem('access_token', token);
    
    // Charger les données nécessaires
    fetchCategories();
    fetchColors();
    fetchSizes();
    fetchTags();
  }, [router]);
  
  // Récupérer les catégories principales
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.kambily.store/categories/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      // Filtrer pour n'avoir que les catégories principales (is_main = true)
      // const mainCategories = data.filter(category => category.is_main === true);
      setAvailableCategories(data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      toast.error('Erreur lors du chargement des catégories');
    }
  };
  
  // Récupérer les couleurs
  const fetchColors = async () => {
    try {
      const response = await fetch('https://api.kambily.store/colors/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setAvailableColors(data);
    } catch (err) {
      console.error('Erreur lors du chargement des colors:', err);
      toast.error('Erreur lors du chargement des colors');
    }
  };
  
  // Récupérer les tailles
  const fetchSizes = async () => {
    try {
      const response = await fetch('https://api.kambily.store/sizes/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setAvailableSizes(data);
    } catch (err) {
      console.error('Erreur lors du chargement des tailles:', err);
      toast.error('Erreur lors du chargement des tailles');
    }
  };
  
  // Récupérer les tags
  const fetchTags = async () => {
    try {
      const response = await fetch('https://api.kambily.store/tags/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      setAvailableTags(data);
    } catch (err) {
      console.error('Erreur lors du chargement des étiquettes:', err);
      toast.error('Erreur lors du chargement des étiquettes');
    }
  };
  
  // Gérer l'ajout d'images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Créer les previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagesPreviews(prev => [...prev, ...newPreviews]);
    
    // Stocker les fichiers
    setImageFiles(prev => [...prev, ...files]);
  };
  
  // Supprimer une image
  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {     
      // Vérifier si des images ont été sélectionnées
      if (imageFiles.length === 0) {
        setError ('Au moins une image est requise');
        setLoading (false);
        return;
      }
      
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
      
      // Si vous avez plusieurs fichiers, parcourez-les et ajoutez-les
      Array.from(ref.current.files).forEach((file, index) => {
        data.append(`images`, file);
      });
      
      console.log(data)
      const token = localStorage.getItem ('access_token');
      
      
      const url = 'https://api.kambily.store/products/create/';
      const meta = {
        method: 'POST',
        body: data,
        headers : {
          'Authorization' : `Bearer ${token}`,
        },
      };
      const promise = fetch(url, meta)
      promise.then(response => response.json() ) // pour ne pas bloquer l'interface user
          .then(data => {
            console.log(data);
            setLoading(false)
          })
          .catch(error => {
            setError(error.message);
            setLoading(false)
            console.log(error.message);
          });
    }catch (e) {
      setError(error.message);
      setLoading(false)
    }
  }
  
  return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Ajouter un nouveau produit</h1>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Informations de base */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Informations de base</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                  <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData ({...formData, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                      required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix régulier</label>
                    <input
                        type="number"
                        step={0.01}
                        min={0}
                        value={formData.regular_price}
                        onChange={(e) => setFormData ({...formData, regular_price: parseFloat (e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix promotionnel</label>
                    <input
                        type="number"
                        step={0.01}
                        min={0}
                        value={formData.promo_price}
                        onChange={(e) => setFormData ({...formData, promo_price: parseFloat (e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description courte</label>
                  <textarea
                      value={formData.short_description}
                      onChange={(e) => setFormData ({...formData, short_description: e.target.value})}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description longue</label>
                  <textarea
                      value={formData.long_description}
                      onChange={(e) => setFormData ({...formData, long_description: e.target.value})}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                  />
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.stock_status}
                        onChange={(e) => setFormData ({...formData, stock_status: e.target.checked})}
                        className="rounded border-gray-300 text-[#048B9A] focus:ring-[#048B9A]"
                    />
                    <span className="ml-2 text-sm text-gray-700">En stock</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de produit</label>
                  <select
                      value={formData.product_type}
                      onChange={(e) => setFormData ({...formData, product_type: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                  >
                    <option value="simple">simple</option>
                    <option value="variable">variable</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">État du stock</label>
                  <select
                      value={formData.etat_stock}
                      onChange={(e) => setFormData ({...formData, etat_stock: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                  >
                    <option value="En Stock">En stock</option>
                    <option value="Rupture de stock">Rupture de stock</option>
                    <option value="Sur commande">Sur commande</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU (Code produit unique)</label>
                  <input
                      type="text"
                      value={generateSKU(formData)}
                      onChange={(e) => setFormData ({...formData, sku: generateSKU(formData)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                      required
                      placeholder="Ex: PROD-001"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Poids (kg)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.weight}
                        onChange={(e) => setFormData ({...formData, weight: parseFloat (e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Longueur (cm)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.length}
                        onChange={(e) => setFormData ({...formData, length: parseFloat (e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                        required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Largeur (cm)</label>
                    <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={formData.width}
                        onChange={(e) => setFormData ({...formData, width: parseFloat (e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hauteur (cm)</label>
                    <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={formData.height}
                        onChange={(e) => setFormData ({...formData, height: parseFloat (e.target.value)})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                        required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantité en stock</label>
                  <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData ({...formData, quantity: parseInt (e.target.value, 10)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#048B9A] focus:ring-[#048B9A]"
                      required
                  />
                </div>
              </div>
            </div>
            
            {/* Catégories, Couleurs, Tailles et Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Attributs du produit</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Catégories */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#048B9A] rounded-full"></span>
                    Catégories principales
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
                {formData.product_type === 'variable' && (
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
                {formData.product_type === 'variable' && (
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
            
            {/* Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Images du produit</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                      />
                      <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                ))}
                
                <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#048B9A] transition-colors cursor-pointer">
                  <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={ref}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <FaPlus className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Ajouter des images</span>
                  </div>
                </label>
              </div>
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                  {error}
                </div>
            )}
            
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#048B9A] text-white py-3 rounded-lg hover:bg-[#037483] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création en cours...
                  </div>
              ) : (
                  'Créer le produit'
              )}
            </button>
          </form>
        </div>
      </div>
  );
}

