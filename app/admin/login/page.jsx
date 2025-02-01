'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaLock } from 'react-icons/fa';
import { getAxiosConfig, HOST_IP, PORT, PROTOCOL_HTTP } from "../../../constants";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from 'formik';
import {useLogin} from "../../context/LoginContext";

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required("Email requis"),
  password: Yup.string().required("Mot de passe requis"),
});

const AdminLogin = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const {changeToken, changeRefresh, changeUser} = useLogin()
  
  const formik = useFormik({
    initialValues: {email : '', password: ''},
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      const url = `${PROTOCOL_HTTP}://${HOST_IP}${PORT}/accounts/login/`;
      
      try {
        const response = await axios.post(url, values, getAxiosConfig(localStorage.getItem('access_token')));
        changeToken(response.data.access);
        changeRefresh(response.data.refresh);
        changeUser(response.data.user);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user", response.data.user);
        router.push('/admin/products');
      } catch (error) {
        setError(error.message);
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <Image src="/logo.webp" alt="Kambily Logo" width={150} height={50} className="mb-6" />
            <h2 className="text-center text-3xl font-bold text-gray-900">Administration</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Connectez-vous à votre espace administrateur</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">{error}</div>}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
                    placeholder="admin@kambily.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#048B9A]"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>
              
              <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#048B9A] hover:bg-[#037483] focus:outline-none transition-colors ${formik.isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {formik.isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connexion en cours...</span>
                    </>
                ) : (
                    <>
                      <FaLock />
                      <span>Se connecter</span>
                    </>
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-gray-500">
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className="text-[#048B9A] hover:text-[#037483]">conditions d'utilisation</a>
          </p>
        </div>
      </div>
  );
};

export default AdminLogin;
