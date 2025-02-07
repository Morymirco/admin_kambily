'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaComments, FaEdit, FaLayerGroup, FaList, FaPlus, FaSearch, FaSort, FaSortDown, FaSortUp, FaTags, FaTrash } from 'react-icons/fa';
import { HOST_IP, PORT, PROTOCOL_HTTP } from '@/constants';
import WithAuth from '@/app/hoc/WithAuth';

const ProductsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le tri
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // États pour les filtres
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priceRange: ''
  });

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Calculer les produits à afficher pour la page courante
  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Mettre à jour le nombre total de pages quand les produits filtrés changent
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    // Revenir à la première page si les filtres changent
    setCurrentPage(1);
  }, [filteredProducts, itemsPerPage]);

  // Composant de pagination
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // Calculer la plage de pages à afficher
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajuster si on est près du début ou de la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Affichage de{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}
            </span>{' '}
            à{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            sur{' '}
            <span className="font-medium">{filteredProducts.length}</span> résultats
          </span>

          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="ml-4 px-2 py-1 border rounded-md text-sm"
          >
            <option value={10}>10 par page</option>
            <option value={25}>25 par page</option>
            <option value={50}>50 par page</option>
            <option value={100}>100 par page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            ««
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            «
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === number
                  ? 'bg-[#048B9A] text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            »
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            »»
          </button>
        </div>
      </div>
    );
  };

  // Fonction de tri
  const sortProducts = (productsToSort, key, direction) => {
    return [...productsToSort].sort((a, b) => {
      if (key === 'price') {
        return direction === 'asc' 
          ? parseFloat(a.price) - parseFloat(b.price)
          : parseFloat(b.price) - parseFloat(a.price);
      }
      
      if (key === 'date') {
        return direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }

      return direction === 'asc'
        ? a[key]?.toString().localeCompare(b[key]?.toString())
        : b[key]?.toString().localeCompare(a[key]?.toString());
    });
  };

  // Gestionnaire de tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fonction de recherche et filtrage
  const filterProducts = (products) => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === '' || 
        product.category === filters.category;

      const matchesStatus = filters.status === '' || 
        product.status === filters.status;

      const matchesPriceRange = filters.priceRange === '' || 
        (filters.priceRange === 'low' && product.price < 50000) ||
        (filters.priceRange === 'medium' && product.price >= 50000 && product.price < 100000) ||
        (filters.priceRange === 'high' && product.price >= 100000);

      return matchesSearch && matchesCategory && matchesStatus && matchesPriceRange;
    });
  };

  // Effet pour appliquer la recherche, les filtres et le tri
  useEffect(() => {
    let result = filterProducts(products);
    result = sortProducts(result, sortConfig.key, sortConfig.direction);
    setFilteredProducts(result);
  }, [searchQuery, filters, sortConfig, products]);

  // Icône de tri pour les en-têtes de colonnes
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erreur lors du chargement des produits');
        }

        const data = await response.json();
        console.log('Données reçues:', data);

        // Vérifiez si data est un tableau
        if (Array.isArray(data.products)) {
          const transformedProducts = data.products.map(product => ({
            id: product.id,
            image: product.images?.[0]?.image || '/placeholder.png',
            name: product.name,
            category: product.categories?.[0]?.name || 'Non catégorisé',
            price: parseFloat(product.regular_price) || 0,
            stock: parseInt(product.quantity) || 0,
            status: product.stock_status ? 'active' : 'inactive',
            tags: [
              ...product.etiquettes?.map(tag => tag.name) || []
            ],
            date: new Date().toISOString(),
            short_description: product.short_description,
            long_description: product.long_description,
            promo_price: product.promo_price,
            sku: product.sku,
            dimensions: {
              weight: product.weight,
              length: product.length,
              width: product.width,
              height: product.height
            },
            product_type: product.product_type,
            colors: product.colors || [],
            sizes: product.sizes || [],
            gallery: product.images?.map(img => img.image) || []
          }));

          setProducts(transformedProducts);
        } else {
          throw new Error('Les données reçues ne sont pas un tableau');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        toast.error('Erreur lors du chargement des produits');
        
        if (err.message.includes('401') || err.message.includes('403')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        toast.success('Produit supprimé avec succès');
        // Rafraîchir la liste des produits
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Supprimer ${selectedProducts.length} produit(s) ?`)) {
      // Logique de suppression ici
      toast.success(`${selectedProducts.length} produit(s) supprimé(s)`);
      setSelectedProducts([]);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/admin/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#048B9A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#048B9A] text-white rounded-lg"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête avec filtres et recherche */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des produits</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredProducts.length} produit(s) trouvé(s)
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Menu de navigation rapide */}
          <div className="flex items-center gap-2 mr-4">
            <Link
              href="/admin/products/categories"
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaList className="text-gray-500" />
              <span>Catégories</span>
            </Link>
            <Link
              href="/admin/products/tags"
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaTags className="text-gray-500" />
              <span>Étiquettes</span>
            </Link>
            <Link
              href="/admin/products/attributes"
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaLayerGroup className="text-gray-500" />
              <span>Attributs</span>
            </Link>
            <Link
              href="/admin/products/reviews"
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaComments className="text-gray-500" />
              <span>Avis</span>
            </Link>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-[#048B9A] text-white rounded-lg hover:bg-[#037483]"
          >
            <FaPlus />
            <span>Ajouter</span>
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">Toutes les catégories</option>
            {/* Liste unique des catégories */}
            {[...new Set(products.map(p => p.category))].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">Toutes les gammes de prix</option>
            <option value="low">Moins de 50 000 GNF</option>
            <option value="medium">50 000 - 100 000 GNF</option>
            <option value="high">Plus de 100 000 GNF</option>
          </select>
        </div>
      </div>

      {/* Table des produits */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length}
                  onChange={handleSelectAll}
                  className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                Produit
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-2">
                Catégorie
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('tags')}
              >
                <div className="flex items-center gap-2">
                Étiquettes
                  {getSortIcon('tags')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-2">
                  Prix
                  {getSortIcon('price')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center gap-2">
                Stock
                  {getSortIcon('stock')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                Statut
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getCurrentPageItems().map((product) => (
              <tr 
                key={product.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded text-[#048B9A] focus:ring-[#048B9A]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1 flex-wrap">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price.toLocaleString()} GNF
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/products/${product.id}/edit`);
                    }}
                    className="text-[#048B9A] hover:text-[#037483] mr-3"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Ajouter la pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default WithAuth(ProductsPage); 