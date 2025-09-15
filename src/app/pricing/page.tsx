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
    name: "Analyses de CV",
    freemium: true,
    premium: true,
    ultra: true
  },
  {
    name: "Suivi de candidatures (inclus au départ, puis via crédits)",
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
    name: "Analyses plus longues (coût en crédits)",
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

    
    fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/create-checkout-session`, { 
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
          Packs de crédits
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Commencez gratuitement avec 5 analyses et le suivi de CV inclus. Ajoutez des crédits à partir de 2€ quand vous le souhaitez.
        </p>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Freemium Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${userTier === 'freemium' ? 'border-primary' : 'border-transparent'}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">Gratuit</h3>
              <p className="text-gray-600 mb-6">5 analyses offertes + suivi de CV</p>
              <div className="text-4xl font-bold text-primary mb-6">0€</div>
            </div>
          </div>

          {/* Premium Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${userTier === 'premium' ? 'border-primary' : 'border-transparent'} relative`}>
            <div className="text-center">
              <span className="absolute top-3 right-3 bg-secondary/10 text-secondary text-xs leading-tight py-0.5 px-2 rounded-full">Conseillé</span>
              <h3 className="text-2xl font-bold text-secondary mb-2">Pack 2€</h3>
              <p className="text-gray-600 mb-6">Crédits pour analyses et suivi supplémentaires</p>
              <div className="text-4xl font-bold text-primary mb-6">2€</div>
              <button onClick={() => { buyPremium("premium") }} className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                Acheter pour 2€
              </button>
            </div>
          </div>

          {/* Ultra Card */}
          <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${userTier === 'ultra' ? 'border-primary' : 'border-transparent'}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-secondary mb-2">Pack 5€</h3>
              <p className="text-gray-600 mb-6">Crédits pour analyses longues et options avancées</p>
              <div className="text-4xl font-bold text-primary mb-6">5€</div>
              <button onClick={() => { buyPremium("ultra") }} className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                Acheter pour 5€
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
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Gratuit</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">2€</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">5€</th>
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