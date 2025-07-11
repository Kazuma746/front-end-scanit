'use client';

import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiCheck, FiX } from 'react-icons/fi';
import '@reduxjs/toolkit';

type PlanFeature = {
  name: string;
  freemium: boolean;
  premium: boolean;
  ultra: boolean;
};

const features: PlanFeature[] = [
  {
    name: "Analyse de CV basique",
    freemium: true,
    premium: true,
    ultra: true
  },
  {
    name: "Suggestions d'amélioration ATS",
    freemium: true,
    premium: true,
    ultra: true
  },
  {
    name: "Nombre d'analyses par mois",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Chat avec l'IA illimité",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Analyse approfondie du design",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Suggestions de mots-clés par secteur",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Comparaison avec les CV du secteur",
    freemium: false,
    premium: false,
    ultra: true
  },
  {
    name: "Génération de CV optimisé",
    freemium: false,
    premium: false,
    ultra: true
  },
  {
    name: "Support prioritaire",
    freemium: false,
    premium: false,
    ultra: true
  }
];

export default function PricingPage() {
  const { user } = useAppSelector((state) => state.auth);
  const userTier = user?.tier || 'freemium';

  const buyPremium = (type: string) => {
    let product = {
      name: "",
      priceId: ""
    };

    // si oui Id du premium sinon Ultra
    if (type == "premium") {
      product.name = "Premium"
      product.priceId = "price_1Ri1dDKrYgMIPA8OFjR2eKyF"; // // mettre ces Id dans le env quand on réussira à le faire marcher

    } else {
      product.name = "Ultra";
      product.priceId = "price_1Ri1dfKrYgMIPA8OOtoNheLv"; // mettre ces Id dans le env quand on réussira à le faire marcher
    }

    console.log("product : " + product.name);

    fetch(`http://localhost:9000/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).then(async (paymentResponse) => {

      let content = await paymentResponse.json();
      if (content.url) {
        window.location.href = content.url;
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Header />
      <main className="container py-12">
        <h1 className="text-3xl font-bold text-secondary text-center mb-4">
          Nos Offres
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Choisissez l'offre qui correspond le mieux à vos besoins et optimisez votre CV pour maximiser vos chances de décrocher l'emploi de vos rêves.
        </p>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Freemium Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${userTier === 'freemium' ? 'border-primary' : 'border-transparent'}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">Freemium</h3>
              <p className="text-gray-600 mb-6">Pour commencer</p>
              <div className="text-4xl font-bold text-primary mb-6">0€</div>
              {userTier === 'freemium' && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full mb-6 inline-block">
                  Votre abonnement actuel
                </div>
              )}
            </div>
          </div>

          {/* Premium Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${userTier === 'premium' ? 'border-primary' : 'border-transparent'}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Pour les professionnels</p>
              <div className="text-4xl font-bold text-primary mb-6">2€</div>
              {userTier === 'premium' && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full mb-6 inline-block">
                  Votre abonnement actuel
                </div>
              )}
              <button onClick={() => { buyPremium("premium") }} className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                Passer au Premium
              </button>
            </div>
          </div>

          {/* Ultra Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${userTier === 'ultra' ? 'border-primary' : 'border-transparent'}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">Ultra</h3>
              <p className="text-gray-600 mb-6">Pour les experts</p>
              <div className="text-4xl font-bold text-primary mb-6">5€</div>
              {userTier === 'ultra' && (
                <div className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full mb-6 inline-block">
                  Votre abonnement actuel
                </div>
              )}
              <button onClick={() => { buyPremium("ultra") }} className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                Passer à l'Ultra
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-secondary text-center py-8">
            Comparaison des fonctionnalités
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Freemium</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Premium</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Ultra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-600">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      {feature.freemium ? (
                        <FiCheck className="inline-block text-green-500 w-5 h-5" />
                      ) : (
                        <FiX className="inline-block text-red-500 w-5 h-5" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.premium ? (
                        <FiCheck className="inline-block text-green-500 w-5 h-5" />
                      ) : (
                        <FiX className="inline-block text-red-500 w-5 h-5" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.ultra ? (
                        <FiCheck className="inline-block text-green-500 w-5 h-5" />
                      ) : (
                        <FiX className="inline-block text-red-500 w-5 h-5" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 