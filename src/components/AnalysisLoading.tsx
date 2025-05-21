import Image from 'next/image';
import FactsCarousel from './FactsCarousel';

const AnalysisLoading = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 mb-8">
          <Image
            src="/loop-search.svg"
            alt="Analyse en cours"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold text-secondary mb-4">
          Analyse approfondie de votre CV en cours...
        </h2>
        <p className="text-gray-600 mb-8">
          Notre IA examine attentivement chaque aspect de votre CV pour vous fournir une analyse détaillée.
        </p>
      </div>
      
      <FactsCarousel />
    </div>
  );
};

export default AnalysisLoading; 