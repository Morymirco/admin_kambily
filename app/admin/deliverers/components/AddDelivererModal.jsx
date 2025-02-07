'use client'
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import axios from "axios";
import {getAxiosConfig, HOST_IP, PORT, PROTOCOL_HTTP} from "../../../../constants";
import KModal from "../../../Components/KModal";
import WithAuth from '@/app/hoc/WithAuth';

const AddDelivererModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      image : null,
      zones: [],
      identity_card: null,
  });
  
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false)
  
  useEffect(()=>{
    axios.get(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/delivery/deliveryzones/`)
        .then(result => {
          console.log(result)
          if( result.status === 200 || result.status === 201){
            setZones(result.data)
          }
        })
        .catch(error=>{
          console.log(error)
        })
        .finally(()=>{
          console.log('finally')
        })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(formData)
    console.log(`Token ${localStorage.getItem('access_token')}`)
    
    axios.post(`${PROTOCOL_HTTP}://${HOST_IP}${PORT}/deliverers/create/`, formData, getAxiosConfig(localStorage.getItem('access_token'), 'multipart/form-data') )
        .then(result => {
            console.log(result)
            if( result.status === 200 || result.status === 201 ){
            
            }
        })
        .catch(error=>{
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
        })
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Ajouter un livreur</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Informations personnelles */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                    <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) =>
                            setFormData ({
                                ...formData, // Conserve le reste de formData
                                first_name: e.target.value,
                            })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Nom</label>
                    <input
                        type="text"
                        name={formData.last_name}
                        value={formData.last_name}
                        onChange={(e) =>
                            setFormData ({
                                ...formData, // Conserve le reste de formData
                                last_name: e.target.value,
                            })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Téléphone</label>
                    <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData ({
                            ...formData,
                            phone_number: e.target.value,
                        })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData ({
                            ...formData,
                            email: e.target.value,
                        })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Zone</label>
                    <select
                        value={formData.zone}
                        onChange={(e) => setFormData ({
                            ...formData,
                            zone: e.target.value,
                        })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    >
                        {
                            zones.map (zone => {
                                return <option value={zone.id} id={zone.id}>{zone.name} {zone.country}</option>
                            })
                        }
                    </select>
                </div>
                
                {/* Mot de passe */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData ({
                            ...formData,
                            password: e.target.value,
                        })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    />
                </div>
                
                {/*<div>*/}
                {/*  <label className="block text-sm text-gray-700 mb-1">Confirmer le mot de passe</label>*/}
                {/*  <input*/}
                {/*      type="password"*/}
                {/*      value={formData.confirmPassword}*/}
                {/*      onChange={(e) => setFormData ({...formData, confirmPassword: e.target.value})}*/}
                {/*      className="w-full px-3 py-2 border rounded-lg text-sm"*/}
                {/*      required*/}
                {/*  />*/}
                {/*</div>*/}
                
                {/* Documents */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Photo</label>
                    <input
                        type="file"
                        onChange={(e) => setFormData ({
                            ...formData,
                            image: e.target.files[0],
                        })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        accept="image/*"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Carte d'identité</label>
                    <input
                        type="file"
                        onChange={(e) => setFormData ({...formData, identity_card: e.target.files[0]})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        accept=".pdf"
                        required
                    />
                </div>
            
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#048B9A] text-white rounded-lg text-sm hover:bg-[#037483]"
                >
                    Ajouter
                </button>
            </div>
        </form>
      </div>
        <KModal isOpen={loading} onClose={()=> setLoading(false)} title={'En cours...'}></KModal>
    </div>
  );
};

export default WithAuth(AddDelivererModal); 