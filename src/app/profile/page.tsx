'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiAlertTriangle, FiUser, FiMail, FiKey, FiTrash2 } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  tier: string;
  phone: string;
  credits: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // États pour les formulaires
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    deleteConfirmPassword: '',
  });
  
  // États pour les messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // États pour les étapes de suppression
  const [deleteStep, setDeleteStep] = useState(0);
  
  // États pour l'affichage des mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }
    
    try {
      // Parser les données utilisateur du localStorage
      const userData = JSON.parse(storedUser);
      
      // Récupérer les informations du token qui pourraient contenir plus de données
      let tokenData: any = {};
      try {
        const tokenParts = token.split('.');
        tokenData = JSON.parse(atob(tokenParts[1]));
        console.log('Token décodé:', tokenData);
      } catch (e) {
        console.error('Erreur lors du décodage du token:', e);
      }
      
      console.log('User data from localStorage:', userData);
      
      // Récupérer les données complètes du localStorage et token
      setUser({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        // Tester toutes les possibilités de nommage et de casse
        userName: userData.userName || userData.username || userData.user_name || 
                 tokenData.userName || tokenData.username || tokenData.user_name || '',
        email: userData.email,
        role: userData.role || tokenData.role || 'user',
        tier: userData.tier || tokenData.tier || 'freemium',
        phone: userData.phone || tokenData.phone || '',
        credits: userData.credits || tokenData.credits || 0
      });
      
      // Pré-remplir le formulaire
      setFormData({
        ...formData,
        username: userData.userName || userData.username || tokenData.userName || tokenData.username || '',
        email: userData.email || ''
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      router.push('/auth/login');
    }
  }, [router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    try {
      // Vérifier que le champ n'est pas vide
      if (!formData.username) {
        throw new Error('Le nom d\'utilisateur ne peut pas être vide');
      }
      
      // Appel à l'API pour mettre à jour le nom d'utilisateur
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userName: formData.username })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du nom d\'utilisateur');
      }
      
      // Mettre à jour les données dans le localStorage
      updateLocalStorageUser({ username: formData.username });
      
      setSuccessMessage('Nom d\'utilisateur mis à jour avec succès');
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    }
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    try {
      // Vérifier que le champ n'est pas vide et est un email valide
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }
      
      // Appel à l'API pour mettre à jour l'email
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: formData.email })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour de l\'adresse email');
      }
      
      // Mettre à jour les données dans le localStorage
      updateLocalStorageUser({ email: formData.email });
      
      setSuccessMessage('Adresse email mise à jour avec succès');
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    try {
      // Vérifier que tous les champs sont remplis
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error('Veuillez remplir tous les champs');
      }
      
      // Vérifier que le nouveau mot de passe et la confirmation correspondent
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Le nouveau mot de passe et sa confirmation ne correspondent pas');
      }
      
      // Vérifier que le nouveau mot de passe est différent de l'ancien
      if (formData.currentPassword === formData.newPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
      }
      
      // Vérifier la complexité du mot de passe (min 8 caractères)
      if (formData.newPassword.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }
      
      // Appel à l'API pour mettre à jour le mot de passe
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          currentPassword: formData.currentPassword,
          password: formData.newPassword 
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du mot de passe');
      }
      
      // Réinitialiser les champs de mot de passe
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccessMessage('Mot de passe mis à jour avec succès');
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    }
  };
  
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    try {
      // Vérifier que le mot de passe est renseigné
      if (!formData.deleteConfirmPassword) {
        throw new Error('Veuillez entrer votre mot de passe pour confirmer');
      }
      
      // Appel à l'API pour vérifier le mot de passe avant suppression
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user?.email,
          password: formData.deleteConfirmPassword 
        })
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Mot de passe incorrect');
      }
      
      // Appel à l'API pour supprimer le compte
      const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        throw new Error(error.message || 'Erreur lors de la suppression du compte');
      }
      
      // Supprimer les données de l'utilisateur du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    }
  };
  
  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  const updateLocalStorageUser = (updates: Partial<{username: string, email: string}>) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const updatedUser = {
        ...userData,
        ...updates
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Mettre à jour l'état du composant
      if (updates.username) {
        setUser(prev => prev ? {...prev, userName: updates.username as string} : null);
      } else if (updates.email) {
        setUser(prev => prev ? {...prev, email: updates.email as string} : null);
      }
    }
  };
  
  const resetDeleteProcess = () => {
    setDeleteStep(0);
    setFormData({
      ...formData,
      deleteConfirmPassword: ''
    });
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Sidebar/Tabs */}
              <div className="bg-gray-50 md:w-1/4 p-4 border-r border-gray-200">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Mon compte</h2>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center space-x-2 ${activeTab === 'profile' ? 'bg-secondary text-white' : 'hover:bg-gray-100'}`}
                  >
                    <FiUser />
                    <span>Information personnelles</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('username')}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center space-x-2 ${activeTab === 'username' ? 'bg-secondary text-white' : 'hover:bg-gray-100'}`}
                  >
                    <FiUser />
                    <span>Changer le pseudo</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('email')}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center space-x-2 ${activeTab === 'email' ? 'bg-secondary text-white' : 'hover:bg-gray-100'}`}
                  >
                    <FiMail />
                    <span>Changer l'email</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center space-x-2 ${activeTab === 'password' ? 'bg-secondary text-white' : 'hover:bg-gray-100'}`}
                  >
                    <FiKey />
                    <span>Changer le mot de passe</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('delete');
                      resetDeleteProcess(); 
                    }}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center space-x-2 text-red-500 ${activeTab === 'delete' ? 'bg-red-50' : 'hover:bg-red-50'}`}
                  >
                    <FiTrash2 />
                    <span>Supprimer le compte</span>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="md:w-3/4 p-6">
                {successMessage && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <p className="text-green-700">{successMessage}</p>
                  </div>
                )}
                
                {errorMessage && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Informations personnelles</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Prénom</p>
                          <p className="font-medium">{user?.firstName}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Nom</p>
                          <p className="font-medium">{user?.lastName}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                          <p className="font-medium">{user?.userName || "Non défini"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{user?.phone || "Non renseigné"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Abonnement</p>
                          <p className="font-medium capitalize">{user?.tier}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Crédits disponibles</p>
                        <p className="font-bold text-lg text-secondary">{user?.credits} crédits</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'username' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Changer le nom d'utilisateur</h3>
                    <form onSubmit={handleUsernameSubmit}>
                      <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Mettre à jour
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'email' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Changer l'adresse email</h3>
                    <form onSubmit={handleEmailSubmit}>
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle adresse email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Mettre à jour
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'password' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Changer le mot de passe</h3>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-4">
                        <div className="relative">
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe actuel
                          </label>
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-8 text-gray-500"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                        
                        <div className="relative">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe
                          </label>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-8 text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                        
                        <div className="relative">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le nouveau mot de passe
                          </label>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-8 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full mt-6 bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Mettre à jour
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'delete' && (
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-6">Supprimer le compte</h3>
                    
                    {deleteStep === 0 && (
                      <div className="bg-red-50 p-4 rounded-md mb-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <FiAlertTriangle className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Attention</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>
                                La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setDeleteStep(1)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Je comprends, continuer
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {deleteStep === 1 && (
                      <div className="space-y-6">
                        <div className="bg-red-50 p-4 rounded-md">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <FiAlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Êtes-vous absolument certain ?</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <p>
                                  Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte, vos données et tous vos documents.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <form onSubmit={handleDeleteAccount}>
                          <div className="relative mb-4">
                            <label htmlFor="deleteConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirmez votre mot de passe
                            </label>
                            <input
                              type={showDeletePassword ? "text" : "password"}
                              id="deleteConfirmPassword"
                              name="deleteConfirmPassword"
                              value={formData.deleteConfirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-8 text-gray-500"
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                            >
                              {showDeletePassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                          
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={resetDeleteProcess}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Supprimer définitivement
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 