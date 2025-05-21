import { useState, useEffect } from 'react';
import cvFacts from '@/data/cv-facts.json';

const FactsCarousel = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Changer de fait toutes les 5 secondes
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentFactIndex(current => {
          const nextIndex = Math.floor(Math.random() * cvFacts.facts.length);
          // Éviter de répéter le même fait
          return nextIndex === current 
            ? (nextIndex + 1) % cvFacts.facts.length 
            : nextIndex;
        });
        setIsTransitioning(false);
      }, 500); // Durée de la transition
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentFact = cvFacts.facts[currentFactIndex];

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-xl font-semibold text-secondary mb-4">Le saviez-vous ?</h3>
        <p className="text-gray-700 mb-2">{currentFact.fact}</p>
        <p className="text-sm text-gray-500 italic">Source : {currentFact.source}</p>
      </div>
    </div>
  );
};

export default FactsCarousel; 