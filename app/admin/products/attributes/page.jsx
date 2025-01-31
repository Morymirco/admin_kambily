'use client'
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';

const AttributesPage = () => {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [attributeType, setAttributeType] = useState('size'); // 'size' ou 'color'
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    description: '',
    code: '' // pour les couleurs uniquement
  });
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Charger les attributs
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/test/login');
          return;
        }

        // Charger les tailles
        const sizesResponse = await fetch('https://api.kambily.store/sizes/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        // Charger les couleurs
        const colorsResponse = await fetch('https://api.kambily.store/colors/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!sizesResponse.ok || !colorsResponse.ok) {
          throw new Error('Erreur lors du chargement des attributs');
        }

        const sizesData = await sizesResponse.json();
        const colorsData = await colorsResponse.json();

        // Combiner et formater les attributs
        const formattedAttributes = [
          ...sizesData.map(size => ({
            id: size.id,
            name: size.name,
            type: 'size',
            description: size.description || 'Taille',
            values: [size.name], // Pour les tailles, la valeur est le nom
            productsCount: size.products_count || 0
          })),
          ...colorsData.map(color => ({
            id: color.id,
            name: color.name,
            type: 'color',
            description: color.description || 'Couleur',
            values: [color.name], // Pour les couleurs, la valeur est le nom
            code: color.code,
            productsCount: color.products_count || 0
          }))
        ];

        setAttributes(formattedAttributes);
      } catch (err) {
        console.error('Erreur:', err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [router]);

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedAttributes(attributes.map(attr => attr.id));
    } else {
      setSelectedAttributes([]);
    }
  }, [attributes]);

  const handleSelectAttribute = useCallback((attributeId) => {
    setSelectedAttributes(prev => 
      prev.includes(attributeId)
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId]
    );
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (window.confirm(`Supprimer ${selectedAttributes.length} attribut(s) ?`)) {
      toast.success(`${selectedAttributes.length} attribut(s) supprimé(s)`);
      setSelectedAttributes([]);
    }
  }, [selectedAttributes.length]);

  const handleEdit = (attribute) => {
    // Implement edit functionality
  };

  const handleDelete = (attributeId) => {
    // Implement delete functionality
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/test/login');
        return;
      }

      // Déterminer l'endpoint en fonction du type d'attribut
      const endpoint = attributeType === 'size' 
        ? 'https://api.kambily.store/sizes/create'
        : 'https://api.kambily.store/colors/create';

      const attributeData = {
        name: newAttribute.name,
        description: newAttribute.description || '',
        ...(attributeType === 'color' && { hex_code: newAttribute.code })
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(attributeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création de l\'attribut');
      }

      const data = await response.json();
      
      // Mettre à jour la liste des attributs
      setAttributes(prev => [...prev, {
        id: data.id,
        name: data.name,
        type: attributeType,
        description: data.description,
        code: data.code,
        values: [data.name],
        productsCount: 0
      }]);

      // Réinitialiser le formulaire
      setNewAttribute({
        name: '',
        description: '',
        code: ''
      });

      toast.success(`${attributeType === 'size' ? 'Taille' : 'Couleur'} ajoutée avec succès`);
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Attributs</h1>
          {selectedAttributes.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedAttributes.length} attribut(s) sélectionné(s)
            </p>
          )}
        </div>
        {selectedAttributes.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-700"
          >
            <FaTrash size={12} />
            Supprimer la sélection
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Ajouter un attribut</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'attribut
                </label>
                <select
                  value={attributeType}
                  onChange={(e) => {
                    setAttributeType(e.target.value);
                    setNewAttribute({ name: '', description: '', code: '' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048B9A]/20 focus:border-[#048B9A]"
                >
                  <option value="size">Taille</option>
                  <option value="color">Couleur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={newAttribute.name}
                  onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048B9A]/20 focus:border-[#048B9A]"
                  required
                  placeholder={attributeType === 'size' ? "ex: XL, 42..." : "ex: Rouge, Bleu..."}
                />
              </div>

              {attributeType === 'color' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code couleur
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newAttribute.code}
                      onChange={(e) => setNewAttribute({...newAttribute, code: e.target.value})}
                      className="h-10 w-20 p-1 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      value={newAttribute.code}
                      onChange={(e) => setNewAttribute({...newAttribute, code: e.target.value})}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="#000000"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAttribute.description}
                  onChange={(e) => setNewAttribute({...newAttribute, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048B9A]/20 focus:border-[#048B9A]"
                  rows={3}
                  placeholder="Description optionnelle"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#048B9A] text-white rounded-lg hover:bg-[#037483]"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>

        {/* Liste des attributs */}
        <div className="col-span-2">
          {/* Barre de recherche */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un attribut..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="w-12 h-12 border-4 border-[#048B9A] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedAttributes.length === attributes.length}
                        onChange={handleSelectAll}
                        className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    {/* Pour les couleurs */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attributes.map((attribute) => (
                    <tr key={`${attribute.type}-${attribute.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAttributes.includes(attribute.id)}
                          onChange={() => handleSelectAttribute(attribute.id)}
                          className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          attribute.type === 'color' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {attribute.type === 'color' ? 'Couleur' : 'Taille'}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">{attribute.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{attribute.description}</td>
                      <td className="px-4 py-4">
                        {attribute.type === 'color' && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: attribute.hex_code }}
                            />
                            <span className="text-sm">{attribute.hex_code}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {attribute.productsCount} produits
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <button 
                          className="text-[#048B9A] hover:text-[#037483]"
                          onClick={() => handleEdit(attribute)}
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(attribute.id)}
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributesPage; 