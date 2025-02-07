'use client'

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaComment, FaEdit, FaEye, FaImages, FaTrash } from 'react-icons/fa';
import { getAxiosConfig, HOST_IP, PORT, PROTOCOL_HTTP } from "../../../../constants";



export default function ProductDetailAdmin() {
  const params = useParams();
  const router = useRouter();
  
  const { token } = useLogin();
  
  const [product, setProduct] = useState({
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
    images: [],
    reviews: [],
  });
  
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchProduct = () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      axios.get(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/${params.id}/`, getAxiosConfig(token))

          .then(response => {
            if (response.status === 200 || response.status === 201) {
              setProduct(response.data);
              console.log(response.data);
            } else {
              throw new Error('Erreur lors du chargement du produit');
            }
          })
          .catch(err => {
            console.error('Erreur:', err);
            setError(err.message);
          });
    };
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);
  
  const handleDelete = () => {
    const isConfirmed = window.confirm('Confirmez-vous la suppression du produit ?');
    
    if (!isConfirmed) return;
    axios.delete(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/delete/${params.id}/`, getAxiosConfig(token))
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            toast.success('Suppression');
            router.push('/admin/products');
          } else {
            console.log(res.data);
            toast.error(res.data.detail);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setIsDeleting(false);
          setShowDeleteModal(false);
        });
  };
  
  // const handleDelete = () => {
  //   setIsDeleting(true);
  //   axios.post(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/products/delete/${params.id}/`, {}, getAxiosConfig(token))
  //       .then(res => {
  //         if (res.status === 200 || res.status === 201) {
  //           toast.success('Suppression');
  //           router.push('/admin/products');
  //         } else {
  //           console.log(res.data);
  //           toast.error(res.data.detail);
  //         }
  //       })
  //       .catch(err => {
  //         console.error(err);
  //       })
  //       .finally(() => {
  //         setIsDeleting(false);
  //         setShowDeleteModal(false);
  //       });
  // };
  
  return (
      <>
        {/* Header Section */}
        <div className="flex justify-between items-center space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <FaArrowLeft className="text-gray-500" />
            </button>
            <h1 className="text-xl font-bold">Détails du produit</h1>
          </div>
          <div className="flex gap-3">
            <Link href={`/test/testafficheproduct/${params.id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <FaEye />
              <span>Voir</span>
            </Link>
            <Link href={`/admin/products/${params.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-[#048B9A] text-white rounded-lg hover:bg-[#037483]">
              <FaEdit />
              <span>Modifier</span>
            </Link>
            <button onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <FaTrash />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
        
        {/* Main Content Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaImages />
                Images
              </h2>
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <Image
                    src={product.images.length === 0 ? '/default.jpg' : product.images[selectedImageIndex].image}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-[#048B9A]' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <Image
                          src={image.image}
                          alt={`${product.name} ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                      />
                    </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Center Column - Main Info */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                  <p className="text-lg font-semibold">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <p className="text-lg font-semibold">{product.regular_price} GNF</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  {product.categories.map((category, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">
                    {category.name}
                  </span>

                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock_status ? 'En stock' : 'Rupture de stock'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{product.long_description}</p>
            </div>
            
            {/* Features Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Couleurs</p>
                  <div>
                    {product.colors.map((color, index) => (
                        <span key={index}
                              style={{ backgroundColor: color.hex_code }}
                              className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>
                      {color.name}
                    </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p>Tailles</p>
                </div>
                
                <div>
                  <p>Categories</p>
                </div>
                
                <div>
                  <p>Etiquettes</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaComment />
            Avis clients
          </h2>
          {product.reviews.length === 0 ? (
              <p>Aucun commentaires sur ce produit</p>
          ) : (
              product.reviews.map((review, index) => (
                  <div key={index} className="flex items-start gap-2.5 my-4">
                    <div className="flex flex-col w-full max-w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div>
                          <Image src={review.user.image} width={40} height={40} className="rounded" alt=""/>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{review.user.first_name} {review.user.last_name}</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">On {review.created_at.replace('T', ' ').replace('Z', '')}</span>
                      </div>
                      <div className="text-base text-gray-700 dark:text-gray-200">
                        {review.comment}
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>
        
        {/* Delete Confirmation KModal */}
        {/*{showDeleteModal && (*/}
        {/*    <DeleteConfirmationModal*/}
        {/*        isOpen={showDeleteModal}*/}
        {/*        onClose={() => setShowDeleteModal(false)}*/}
        {/*        onDelete={handleDelete}*/}
        {/*        isDeleting={isDeleting}*/}
        {/*    />*/}
        {/*)}*/}
      </>
  );
}
