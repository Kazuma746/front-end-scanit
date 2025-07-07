'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiAlertTriangle, FiUser, FiMail, FiKey, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser, updateUserProfile, logout } from '@/store/slices/authSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tooltip from '@/components/ui/Tooltip';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading, token } = useAppSelector((state) => state.auth);
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
      if (!user?.id) {
        throw new Error('ID utilisateur non trouvé');
      }

      await dispatch(updateUserProfile({
        userId: user.id,
        updates: { userName: formData.username }
      })).unwrap();

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
      if (!user?.id) {
        throw new Error('ID utilisateur non trouvé');
      }

      await dispatch(updateUserProfile({
        userId: user.id,
        updates: { email: formData.email }
      })).unwrap();

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

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      if (!user?.id) {
        throw new Error('ID utilisateur non trouvé');
      }

      const result = await dispatch(updateUserProfile({
        userId: user.id,
        updates: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }
      })).unwrap();

      setSuccessMessage('Mot de passe mis à jour avec succès');
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
      if (!user?.id) {
        throw new Error('ID utilisateur non trouvé');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: formData.deleteConfirmPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la suppression du compte');
      }

      // Déconnexion après suppression réussie
      dispatch(logout());
      router.push('/');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de la suppression du compte');
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
        <main className="container py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Mon profil
            </h1>
            <p className="text-gray-600">
              Bienvenue {user?.firstName}, gérez vos informations personnelles
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Sidebar/Tabs */}
              <div className="bg-gray-50 md:w-64 p-6 border-r border-gray-200">
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-secondary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className="flex-shrink-0" />
                    <span>Informations</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('username')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'username' 
                        ? 'bg-secondary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className="flex-shrink-0" />
                    <span>Changer le pseudo</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('email')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'email' 
                        ? 'bg-secondary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiMail className="flex-shrink-0" />
                    <span>Changer l'email</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'password' 
                        ? 'bg-secondary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiKey className="flex-shrink-0" />
                    <span>Changer le mot de passe</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('delete');
                      resetDeleteProcess();
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === 'delete' 
                        ? 'bg-red-500 text-white' 
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <FiTrash2 className="flex-shrink-0" />
                    <span>Supprimer le compte</span>
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    {errorMessage}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6">
                      Informations personnelles
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Prénom</p>
                        <p className="font-medium text-gray-900">{user?.firstName}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Nom</p>
                        <p className="font-medium text-gray-900">{user?.lastName}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Nom d'utilisateur</p>
                        <p className="font-medium text-gray-900">{user?.userName || "Non défini"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{user?.email}</p>
                          {!user?.isVerified && (
                            <Tooltip content="Email non vérifié">
                              <div className="flex items-center text-yellow-600">
                                <FiAlertCircle className="w-5 h-5" />
                              </div>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                        <p className="font-medium text-gray-900">{user?.phone || "Non renseigné"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Abonnement</p>
                        <p className="font-medium text-gray-900 capitalize">{user?.tier}</p>
                      </div>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Crédits disponibles</p>
                      <p className="font-bold text-2xl text-secondary">{user?.credits} crédits</p>
                    </div>
                  </div>
                )}

                {activeTab === 'username' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6">
                      Changer le nom d'utilisateur
                    </h2>
                    <form onSubmit={handleUsernameSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      >
                        {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6">
                      Changer l'adresse email
                    </h2>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle adresse email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      >
                        {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'password' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6">
                      Changer le mot de passe
                    </h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      >
                        {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'delete' && (
                  <div>
                    <h2 className="text-xl font-bold text-red-600 mb-6">
                      Supprimer le compte
                    </h2>
                    
                    {deleteStep === 0 ? (
                      <div>
                        <div className="bg-red-50 p-4 rounded-lg mb-6">
                          <div className="flex items-center mb-4">
                            <FiAlertTriangle className="text-red-600 mr-2" size={24} />
                            <h3 className="text-lg font-medium text-red-600">Attention</h3>
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
                          className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium"
                        >
                          Je comprends, je veux supprimer mon compte
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleDeleteAccount} className="space-y-6">
                        <div>
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showDeletePassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={resetDeleteProcess}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            {isLoading ? 'Suppression...' : 'Supprimer définitivement'}
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
      </main>
      <Footer />
    </>
  );
} 