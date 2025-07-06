'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


export default function EmailConfirmation () {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');


    useEffect(() => {
        const token = searchParams.get('userToken');
        if (!token) {
            setStatus('error');
            setMessage('Token manquant dans l’URL.');
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_DATABASE_SERVICE_URL}/users/email/confirm/${token}`)
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    setStatus('success');
                    setMessage('Votre adresse email a été confirmée avec succès !');
                    setTimeout(() => router.push('/auth/login'), 5000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Erreur lors de la confirmation.');
                }
            })
            .catch((err) => {
                //console.error('Erreur réseau :', err);
                setStatus('error');
                setMessage('Une erreur est survenue lors de la vérification du token.');
            });
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center">
                {status === 'loading' && (
                    <div>
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto rounded-full mb-4"></div>
                        <p className="text-gray-600">Confirmation en cours...</p>
                    </div>
                )}
                {status === 'success' && (
                    <div>
                        <h2 className="text-green-600 text-xl font-semibold mb-2">Succès</h2>
                        <p>{message}</p>
                        <p className="text-sm mt-2 text-gray-500">Redirection vers la connexion...</p>
                    </div>
                )}
                {status === 'error' && (
                    <div>
                        <h2 className="text-red-600 text-xl font-semibold mb-2">Erreur</h2>
                        <p>{message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl"
                        >
                            Réessayer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
