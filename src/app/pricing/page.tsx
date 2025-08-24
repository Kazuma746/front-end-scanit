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
    name: "Analyses de CV (limitées en gratuit, +crédits)",
    freemium: true,
    premium: true,
    ultra: true
  },
  {
    name: "Suivi de candidatures (limité en gratuit, +crédits)",
    freemium: true,
    premium: true,
    ultra: true
  },
  {
    name: "Recommandations compatibles ATS",
    freemium: true,
    premium: true,
    ultra: true
  },
  {
    name: "Analyses plus longues (plus de jetons)",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Historique et export des rapports",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Support prioritaire",
    freemium: false,
    premium: true,
    ultra: true
  },
  {
    name: "Rappels et relances automatiques avancés",
    freemium: false,
    premium: false,
    ultra: true
  },
  {
    name: "Accès anticipé aux nouvelles fonctionnalités",
    freemium: false,
    premium: false,
    ultra: true
  }
];

export default function PricingPage() {
  const { user, token } = useAppSelector((state) => state.auth);
  const userTier = user?.tier || 'freemium';

  const buyPremium = (type: string) => {
    let product = {
      productName: "",
      priceId: "",
      userId: user?.id
    };

    // si oui Id du premium sinon Ultra
    if (type == "premium") {
      product.productName = "Premium"
      product.priceId = "price_1RiDAFKrYgMIPA8Oa0wUMy69"; // // mettre ces Id dans le env quand on réussira à le faire marcher

    } else {
      product.productName = "Ultra";
      product.priceId = "price_1RiDC1KrYgMIPA8OPXB8DqBv"; // mettre ces Id dans le env quand on réussira à le faire marcher
    }


    console.log("product : " + JSON.stringify(product));


    fetch(`http://localhost:9000/create-checkout-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
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
          Commencez gratuitement. Des crédits optionnels vous donnent accès à davantage d’analyses, à un suivi étendu et à des analyses plus longues.
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
              <p className="text-gray-600 mb-6">Idéal pour un usage régulier (plus de crédits, plus de suivi)</p>
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
              <p className="text-gray-600 mb-6">Analyses plus longues et fonctionnalités avancées</p>
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