'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch } from '@/store/hooks';
import AuthButton from '@/components/ui/AuthButton';
import LogoWithTagline from '@/components/ui/LogoWithTagline';


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Vérification côté client que tous les champs sont remplis
      const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'password', 'phone'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

      if (missingFields.length > 0) {
        throw new Error(`Veuillez remplir tous les champs requis: ${missingFields.join(', ')}`);
      }

      // Appel direct à l'API d'inscription
      const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'user',
          tier: 'freemium'
        }),
      });

      if (!registerResponse.ok) {
        const registerData = await registerResponse.json();
        throw new Error(registerData.message || `Erreur lors de l'inscription (${registerResponse.status})`);
      }

      // Enregistrement réussi, maintenant connecter l'utilisateur
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Inscription réussie, mais erreur lors de la connexion');
      }

      // Stocker le token
      localStorage.setItem('token', loginData.token);

      // Récupérer les informations de l'utilisateur depuis le token
      const tokenParts = loginData.token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      // Stocker les informations de l'utilisateur
      localStorage.setItem('user', JSON.stringify({
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username
      }));

      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    const popup = window.open(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/google/auth`, 'googleLogin', 'width=500,height=600');

    // Écouter le message venant de la popup
    window.addEventListener('message', async (event) => {
      if (event.origin !== `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}`) return; // Sécurité : vérifier l'origine

      const { token } = event.data;
      //console.log("Token reçu :", token);

      localStorage.setItem('token', token);

      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      //Stocker les informations de l'utilisateur
      localStorage.setItem('user', JSON.stringify({
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username
      }));
                
      popup?.close(); // ferme la popup bg
      router.push('/');      
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <LogoWithTagline className="text-left" />
      </div>
      
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div>
              <h1 className="text-center text-2xl font-bold text-gray-900">Créer un compte</h1>
              <p className="mt-3 text-center text-sm text-gray-600">
                Ou{' '}
                <Link href="/auth/login" className="font-medium text-primary hover:text-secondary">
                  connectez-vous à votre compte
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">Prénom</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">Nom</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="userName" className="sr-only">Nom d'utilisateur</label>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    value={formData.userName}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nom d'utilisateur"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Email"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="sr-only">Mot de passe</label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5 text-gray-500" /> : <FiEye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>

                <div>
                  <label htmlFor="phone" className="sr-only">Téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Téléphone"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <AuthButton
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                >
                  S'inscrire
                </AuthButton>

                <AuthButton
                  type="button"
                  onClick={loginWithGoogle}
                >
                  <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                    <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z">
                  </path>
                </svg>
                Se connecter avec google
              </AuthButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 