import React from 'react';
import { LuCircleX } from "react-icons/lu";

export default function Cancel(){
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
        <LuCircleX className="text-red-500 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2 text-red-700">Paiement annulé</h1>
        <p className="text-gray-600 mb-4">Votre paiement n’a pas été finalisé. Vous pouvez réessayer à tout moment.</p>
        <a href="/" className="text-red-600 font-medium hover:underline">Retour à l’accueil</a>
      </div>
    </div>
  );
};

