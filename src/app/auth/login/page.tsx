'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';
import AuthButton from '@/components/ui/AuthButton';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  // Nettoyer l'état d'erreur au chargement de la page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Vérification que les champs email et password sont remplis
      if (!email || !password) {
        throw new Error('Veuillez remplir tous les champs');
      }
      
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      if (result) {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <Logo size="lg" />
      </div>
      
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div>
              <h1 className="text-center text-2xl font-bold text-gray-900">
                Connexion
              </h1>
              <p className="mt-3 text-center text-sm text-gray-600">
                Ou{' '}
                <Link href="/auth/register" className="font-medium text-primary hover:text-secondary">
                  créez un compte
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
                <div>
                  <label htmlFor="email" className="sr-only">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-10"
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <AuthButton
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Se connecter
                </AuthButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 