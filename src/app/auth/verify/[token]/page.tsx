'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { verifyEmail } from '@/store/slices/authSlice';

export default function VerifyEmail({ params }: { params: { token: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre email en cours...');

  useEffect(() => {
    const verify = async () => {
      try {
        await dispatch(verifyEmail(params.token)).unwrap();
        setStatus('success');
        setMessage('Votre email a été vérifié avec succès !');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Une erreur est survenue lors de la vérification.');
      }
    };

    verify();
  }, [params.token, router, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
          SCAN.IT
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Votre job commence ici
        </p>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-2xl font-semibold mb-6">
            Vérification de votre email
          </h2>
          <div className={`rounded-md p-4 ${
            status === 'loading' ? 'bg-blue-50' :
            status === 'success' ? 'bg-green-50' :
            'bg-red-50'
          }`}>
            <p className={`text-center ${
              status === 'loading' ? 'text-blue-700' :
              status === 'success' ? 'text-green-700' :
              'text-red-700'
            }`}>
              {message}
            </p>
          </div>
          {status === 'error' && (
            <div className="mt-6 text-center">
              <a
                href="/auth/login"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Retour à la connexion
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 