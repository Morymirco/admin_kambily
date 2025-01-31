'use client'
import { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import {HOST_IP, PORT, PROTOCOL_HTTP, generateSlug, formatNumber} from "../../../constants";
import toast, { Toaster } from 'react-hot-toast';

// Composant pour le bouton de suppression en masse
const BulkDeleteButton = ({ selectedCount, onDelete }) => (
  <button
    onClick={onDelete}
    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-700"
  >
    <FaTrash size={12} />
    Supprimer la sélection
  </button>
);

// Composant pour le formulaire d'ajout
const AddTagForm = ({ newTag, onSubmit, onChange, isLoading }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm text-gray-700 mb-1">Nom</label>
      <input
        type="text"
        value={newTag.name}
        onChange={(e) => onChange({...newTag, name: e.target.value})}
        className="w-full px-3 py-2 border rounded-lg text-sm"
        required
        disabled={isLoading}
      />
    </div>
    <div>
      <label className="block text-sm text-gray-700 mb-1">Slug</label>
      <input
        type="text"
        value={newTag.slug}
        onChange={(e) => onChange({...newTag, slug: e.target.value})}
        className="w-full px-3 py-2 border rounded-lg text-sm"
        required
        disabled={isLoading}
      />
    </div>
    <div>
      <label className="block text-sm text-gray-700 mb-1">Description</label>
      <textarea
        value={newTag.description}
        onChange={(e) => onChange({...newTag, description: e.target.value})}
        className="w-full px-3 py-2 border rounded-lg text-sm"
        rows={4}
        disabled={isLoading}
      />
    </div>
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-[#048B9A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#037483] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Ajout en cours...</span>
        </>
      ) : (
        'Ajouter'
      )}
    </button>
  </form>
);

// Composant pour une ligne du tableau
const TagRow = ({ tag, isSelected, onSelect, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 py-4">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(tag.id)}
        className="rounded text-[#048B9A] focus:ring-[#048B9A]"
      />
    </td>
    <td className="px-4 py-4">
      <div className="font-medium">{tag.name}</div>
      <div className="text-xs text-gray-500">{tag.slug}</div>
    </td>
    <td className="px-4 py-4 text-sm text-gray-500">
      {tag.description}
    </td>
    <td className="px-4 py-4 text-sm text-gray-500">
      {tag.x}
    </td>
    <td className="px-4 py-4 text-sm font-medium text-gray-900">
      {formatNumber(tag.total)} GNF
    </td>
    <td className="px-4 py-4 text-right space-x-2">
      <button onClick={onEdit} className="text-[#048B9A] hover:text-[#037483]">
        <FaEdit size={14} />
      </button>
      <button onClick={onDelete} className="text-red-600 hover:text-red-800">
        <FaTrash size={14} />
      </button>
    </td>
  </tr>
);

const TagsPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupération des tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/tags/`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        console.log(data)
        setTags(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        toast.error('Erreur lors du chargement des tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Mise à jour du nom et génération automatique du slug
  const handleNameChange = (name) => {
    setNewTag(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  // Ajout d'un tag avec meilleure gestion des erreurs
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', newTag.name);
    formData.append('slug', newTag.slug);
    formData.append('description', newTag.description);

    try {
      const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/tags/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      const data = await response.json();
      setTags(prevTags => [...prevTags, data]);
      toast.success('Tag ajouté avec succès', {
        duration: 3000,  // Durée en millisecondes
        position: 'top-right', // Position du toast
        style: {
          background: 'green',
          color: 'white',
        },
      });
      setNewTag({ name: '', slug: '', description: '' });
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression d'un tag
  const handleDelete = async (tagId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) return;

    try {
      const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/tags/${tagId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const responseData = await response.json();
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      toast.success('Tag supprimé avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message);
    }
  };

  // Suppression en masse
  const handleBulkDelete = async () => {
    if (!window.confirm(`Supprimer ${selectedTags.length} tag(s) ?`)) return;

    try {
      const deletePromises = selectedTags.map(tagId =>
        fetch(`https://api.kambily.store/products/tags/${tagId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
      );

      await Promise.all(deletePromises);

      setTags(prevTags => prevTags.filter(tag => !selectedTags.includes(tag.id)));
      toast.success(`${selectedTags.length} tag(s) supprimé(s)`);
      setSelectedTags([]);
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors de la suppression des tags');
    }
  };

  // Mise à jour d'un tag
  const handleEdit = async (tagId, updatedData) => {
    try {
      const response = await fetch(`https://api.kambily.store/products/tags/${tagId}/`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du tag');
      }

      const updatedTag = await response.json();
      setTags(prevTags => 
        prevTags.map(tag => tag.id === tagId ? updatedTag : tag)
      );
      toast.success('Tag mis à jour avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message);
    }
  };

  // Filtrage des tags selon la recherche
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour sélectionner/désélectionner tous les tags
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTags(tags.map(tag => tag.id));
    } else {
      setSelectedTags([]);
    }
  };

  // Fonction pour sélectionner/désélectionner un tag
  const handleSelectTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-[#048B9A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-[#048B9A] text-white rounded hover:bg-[#037483]"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Étiquettes</h1>
          {selectedTags.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {selectedTags.length} étiquette(s) sélectionnée(s)
            </p>
          )}
        </div>
        {selectedTags.length > 0 && (
          <BulkDeleteButton
            selectedCount={selectedTags.length}
            onDelete={handleBulkDelete}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-medium mb-4">Ajouter une étiquette</h2>
            <AddTagForm
              newTag={newTag}
              onSubmit={handleSubmit}
              onChange={(updatedTag) => {
                if (updatedTag.name !== newTag.name) {
                  handleNameChange(updatedTag.name);
                } else {
                  setNewTag(updatedTag);
                }
              }}
              isLoading={isSubmitting}
            />
            {newTag.name && (
              <p className="mt-2 text-sm text-gray-500">
                Slug généré : {newTag.slug}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une étiquette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTags.length === tags.length}
                      onChange={handleSelectAll}
                      className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTags.map((tag) => (
                  <TagRow
                    key={tag.id}
                    tag={tag}
                    isSelected={selectedTags.includes(tag.id)}
                    onSelect={handleSelectTag}
                    onEdit={() => handleEdit(tag.id, tag)}
                    onDelete={() => handleDelete(tag.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default TagsPage; 