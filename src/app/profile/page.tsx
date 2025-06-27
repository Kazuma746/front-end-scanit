'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiAlertTriangle, FiUser, FiMail, FiKey, FiTrash2 } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
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
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      setFormData({
        ...formData,
        username: user.userName || '',
        email: user.email || ''
      });
      setIsLoading(false);
    }
  }, [user, authLoading, router]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ userName: formData.username }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour du pseudo';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Si le parsing JSON échoue, on utilise le message par défaut
          console.error('Erreur lors du parsing de la réponse:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      dispatch(updateUser({ userName: formData.username }));
      setSuccessMessage('Pseudo mis à jour avec succès');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de la mise à jour du pseudo');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour de l\'email';
        try {
          const errorData = await response.json();
          // Vérification spécifique pour l'erreur de doublon d'email
          if (errorData.message && errorData.message.includes('duplicate key error')) {
            errorMessage = 'Cet email est déjà utilisé par un autre compte';
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          console.error('Erreur lors du parsing de la réponse:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      dispatch(updateUser({ email: formData.email }));
      setSuccessMessage('Email mis à jour avec succès');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de la mise à jour de l\'email');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Vérification que les mots de passe correspondent
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ 
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword 
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour du mot de passe';
        try {
          const errorData = await response.json();
          if (response.status === 401) {
            errorMessage = 'Le mot de passe actuel est incorrect';
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          console.error('Erreur lors du parsing de la réponse:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccessMessage('Mot de passe mis à jour avec succès');
      // Réinitialiser les champs du mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de la mise à jour du mot de passe');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password: formData.deleteConfirmPassword }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du compte');
      }

      router.push('/');
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression du compte');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe actuel
                          </label>
                          <div className="relative">
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
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe
                          </label>
                          <div className="relative">
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
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showNewPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le nouveau mot de passe
                          </label>
                          <div className="relative">
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
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
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
                    
                    {deleteStep === 0 ? (
                      <div>
                        <div className="bg-red-50 p-4 rounded-md mb-6">
                          <div className="flex items-center mb-4">
                            <FiAlertTriangle className="text-red-600 mr-2" size={24} />
                            <h4 className="text-lg font-medium text-red-600">Attention</h4>
                          </div>
                          <p className="text-red-600 mb-4">
                            La suppression de votre compte est une action irréversible. Toutes vos données seront définitivement effacées.
                          </p>
                          <ul className="list-disc list-inside text-red-600 space-y-2">
                            <li>Vos informations personnelles</li>
                            <li>Votre historique d'analyse</li>
                            <li>Vos crédits restants</li>
                            <li>Vos documents sauvegardés</li>
                          </ul>
                        </div>
                        
                        <button
                          onClick={() => setDeleteStep(1)}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Je comprends, je veux supprimer mon compte
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleDeleteAccount}>
                        <div className="mb-6">
                          <label htmlFor="deleteConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmez votre mot de passe pour supprimer le compte
                          </label>
                          <div className="relative">
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
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showDeletePassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
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