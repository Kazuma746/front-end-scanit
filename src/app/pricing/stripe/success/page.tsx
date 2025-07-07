import React from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';

export default function Success() {
  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
        <FaRegCircleCheck className="text-green-500 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2 text-green-700">Paiement réussi</h1>
        <p className="text-gray-600 mb-4">Merci pour votre achat. Votre transaction a été traitée avec succès.</p>
        <a href="/" className="text-green-600 font-medium hover:underline">Retour à l’accueil</a>
      </div>
    </div>
  );
};
