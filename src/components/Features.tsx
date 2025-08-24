import { FiBarChart2, FiTarget, FiLock } from 'react-icons/fi';
import Link from 'next/link';

const Features = () => {
  const features = [
    {
      icon: <FiBarChart2 className="w-12 h-12 text-primary" />,
      title: "Analyse de CV",
      description: "Comprenez comment les ATS lisent votre CV et recevez des recommandations concrètes."
    },
    {
      icon: <FiTarget className="w-12 h-12 text-primary" />,
      title: "Suivi de candidatures",
      description: "Centralisez vos candidatures, suivez les statuts et organisez vos relances."
    },
    {
      icon: <FiLock className="w-12 h-12 text-primary" />,
      title: "Gratuit pour démarrer",
      description: "Commencez gratuitement. Des crédits optionnels débloquent davantage d’analyses et de suivis."
    }
  ];

  return (
    <section id="features" className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">Maîtrisez vos candidatures</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Analyse de CV compatible ATS et suivi de candidatures, réunis sur une seule plateforme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/analyze" className="btn-primary">
            Analyser un CV
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features; 