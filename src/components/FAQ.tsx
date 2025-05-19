'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Qu'est-ce que l'optimisation ATS pour un CV ?",
      answer: "L'optimisation ATS consiste à adapter votre CV pour qu'il soit correctement analysé par les systèmes de suivi des candidats (ATS). Ces logiciels filtrent les candidatures avant qu'elles n'atteignent les recruteurs. Un CV optimisé pour l'ATS contient les bons mots-clés, une mise en page compatible et un format adapté pour maximiser vos chances d'être sélectionné."
    },
    {
      question: "Comment fonctionne l'analyse de CV sur ScanIt ?",
      answer: "Notre outil analyse votre CV en utilisant des algorithmes similaires à ceux des ATS, puis identifie les points forts et faibles. Nous vérifions la présence des mots-clés pertinents pour le poste visé, la structure du document, la mise en page et d'autres facteurs qui influencent la lisibilité par les systèmes automatisés et par les recruteurs."
    },
    {
      question: "Le service est-il vraiment gratuit ?",
      answer: "Oui, tous nos outils destinés aux candidats sont entièrement gratuits. Nous ne demandons pas de coordonnées bancaires et il n'y a pas de frais cachés. Notre mission est de vous aider à réussir votre recherche d'emploi sans barrière financière."
    },
    {
      question: "Comment puis-je savoir si mon CV passe les filtres ATS ?",
      answer: "Notre outil d'analyse vous fournit un score et des recommandations détaillées. Un score élevé indique que votre CV est bien optimisé pour passer les filtres ATS. Les recommandations vous aident à améliorer les aspects spécifiques qui pourraient être problématiques."
    },
    {
      question: "Combien de temps faut-il pour analyser mon CV ?",
      answer: "L'analyse de votre CV prend généralement moins d'une minute. Vous recevez immédiatement un rapport détaillé avec des suggestions d'amélioration que vous pouvez appliquer sur notre plateforme ou exporter."
    }
  ];

  return (
    <section id="faq" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">Questions fréquentes</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur notre plateforme d'optimisation de CV.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="mb-4 border-b border-gray-200 pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-lg py-3 focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-secondary">{item.question}</span>
                <span className="text-primary">
                  {activeIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              </button>
              {activeIndex === index && (
                <div className="mt-2 text-gray-600 pb-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 