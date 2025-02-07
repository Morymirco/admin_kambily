"use client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaUndo } from "react-icons/fa";
import { getAxiosConfig, HOST_IP, PORT, PROTOCOL_HTTP } from "../../../../../constants";
import Loader from "../../../../Components/Loader";

export default function EditProductPage() {
  const ref = useRef(null)
  const params = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    long_description: '',
    regular_price: 1,
    promo_price: 1,
    sku: '',
    stock_status: true,
    weight: 1,
    length: 1,
    width: 1,
    height: 1,
    product_type: 'variable',
    etat_stock: 'En Stock',
    quantity: 1,
    categories: [],
    colors: [],
    sizes: [],
    etiquettes: [],
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [loadingAttributes, setLoadingAttributes] = useState(true);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [trash, setTrash] = useState([]);
  
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  
  
  
  // Modifier useEffect pour enlever l'appel à websocketManagement
  useEffect(() => {
    console.log ("Token : ", localStorage.getItem ('access_token') )
    if (!localStorage.getItem ('access_token')) {
      router.push('/login');
      return;
    }
    
    //Charger les donnees du produits
    axios.get(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/${params.id}/`, getAxiosConfig(localStorage.getItem('access_token')) )
        .then(result => {
          setFormData(result.data)
          setFormData({
            ...result.data,
            categories: result.data.categories.map(category => category.id),
            sizes: result.data.sizes.map(size => size.id),
            colors: result.data.colors.map(color => color.id),
            etiquettes: result.data.etiquettes.map(etiquette => etiquette.id),
          })
          console.log (result.data)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(()=>{
          setLoading(false)
          setError(null)
        })
    
    //Charger les données lors de l'initialisation de la page
    axios.get(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/attributes/of/`, getAxiosConfig(localStorage.getItem('access_token')) )
        .then(result => {
          if( result.status === 200 || result.status === 201 ) {
            console.log (result.data)
            setAvailableCategories(result.data.categories)
            setAvailableColors(result.data.colors)
            setAvailableSizes(result.data.sizes)
            setAvailableTags(result.data.tags)
          }
          else{
            console.log(result.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
        .finally(()=>{
          console.log('fin')
          setLoadingAttributes(false)
        })
  }, [router, params.id]);
  
  
  // Gérer l'ajout d'images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({...formData, images: files});
    
    // Créer les previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagesPreviews(prev => [...prev, ...newPreviews]);
    
    // Stocker les fichiers
    setImageFiles(prev => [...prev, ...files]);
  };
  
  // Supprimer une image
  const handleRemoveImage = (index) => {
    // Déplacer l'image dans la corbeille
    setTrash(prev => [...prev, imagesPreviews[index]]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData({...formData, images: Array.from(ref.current.files)});
  };
  
  const handleRestoreImage = (index) => {
    // Restaurer l'image de la corbeille
    setImagesPreviews(prev => [...prev, trash[index]]);
    setTrash(prev => prev.filter((_, i) => i !== index));
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (imageFiles.length === 0) {
      setError ('Au moins une image est requise');
      setLoading (false);
      return;
    }
    
    
    console.log(formData)
    console.log(localStorage.getItem('access_token'))
    axios.put(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/update/${params.id}/`, formData, getAxiosConfig(localStorage.getItem('access_token'), 'multipart/form-data') )
        .then(result => {
          console.log (result)
          router.push('/admin/products');
        })
        .catch(error => {
          console.log(error)
        })
        .finally(()=>{
          setLoading(false)
          setError(null)
        })
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-8">Modifier un produit</h1>
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Informations de base */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Informations de base</h2>
            {loading ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={(e) => setFormData ({
                        ...formData,
                        regular_price: parseFloat (e.target.value)
                      })}
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
                      onChange={(e) => setFormData ({
                        ...formData,
                        promo_price: parseFloat (e.target.value)
                      })}
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
                    value={formData.sku}
                    onChange={(e) => setFormData ({...formData, sku: e.target.value})}
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
            )}
          </div>
          
          {/* Catégories, Couleurs, Tailles et Tags */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Attributs du produit</h2>
            
            {
              loadingAttributes ?
                  <Loader/>
                  :
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
                            {availableColors.map (color => (
                                <label key={color.id}
                                       className="flex items-center p-2 hover:bg-white rounded-md transition-colors">
                                  <input
                                      type="checkbox"
                                      checked={formData.colors.includes (color.id)}
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
                                  style={{backgroundColor: color.hex_code}}
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
                            {availableSizes.map (size => (
                                <label
                                    key={size.id}
                                    className={`
                          flex items-center justify-center p-2 rounded-md cursor-pointer transition-all
                          ${formData.sizes.includes (size.id)
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
                        {availableTags.map (tag => (
                            <label
                                key={tag.id}
                                className={`
                          flex items-center p-2 hover:bg-white rounded-md transition-colors
                          ${formData.etiquettes.includes (tag.id) ? 'bg-white' : ''}
                        `}
                            >
                              <input
                                  type="checkbox"
                                  checked={formData.etiquettes.includes (tag.id)}
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
            }
          </div>
          
          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Images du produit</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {imagesPreviews.map ((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemoveImage (index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FaTrash size={12}/>
                    </button>
                  </div>
              ))}
              
              <label
                  className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#048B9A] transition-colors cursor-pointer">
                    <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={ref}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <FaPlus className="w-8 h-8 text-gray-400"/>
                      <span className="mt-2 text-sm text-gray-500">Ajouter des images</span>
                    </div>
                  </label>
            </div>
          </div>
          
          {/* Corbeille */}
          {trash.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Corbeille</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {trash.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Trash ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRestoreImage(index)}
                      className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                      <FaUndo size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
          )}
          
          <button
              type="submit"
              className="w-full bg-[#048B9A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#037483] disabled:opacity-50"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}