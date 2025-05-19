import { FiBarChart2, FiTarget, FiLock } from 'react-icons/fi';
import Link from 'next/link';

const Features = () => {
  const features = [
    {
      icon: <FiBarChart2 className="w-12 h-12 text-primary" />,
      title: "Analyse approfondie",
      description: "Découvrez comment les logiciels de recrutement voient votre CV et obtenez des suggestions d'amélioration."
    },
    {
      icon: <FiTarget className="w-12 h-12 text-primary" />,
      title: "Optimisation ATS",
      description: "Créez un CV parfaitement adapté aux systèmes de suivi des candidats (ATS) utilisés par les recruteurs."
    },
    {
      icon: <FiLock className="w-12 h-12 text-primary" />,
      title: "100% gratuit",
      description: "Tous nos outils pour candidats sont entièrement gratuits, sans abonnement ni limitation cachée."
    }
  ];

  return (
    <section id="features" className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">Transformez votre recherche d'emploi</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ScanIt vous aide à créer des CV optimisés qui passent les filtres automatisés et attirent l'attention des recruteurs.
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
          <Link
            href="/analyze" 
            className="btn-primary"
          >
            Créer mon CV maintenant
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features; 