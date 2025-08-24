'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ = () => {
  type FaqItem = { question: string; answer: string };

  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleAccordion = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const faqItems: FaqItem[] = [
    {
      question: "Comment fonctionnent l'analyse et le suivi ?",
      answer: "Téléversez votre CV pour obtenir des recommandations compatibles ATS, puis enregistrez et suivez vos candidatures (statuts, relances, notes) dans un tableau de bord."
    },
    {
      question: "Qu'est-ce que le système de crédits ?",
      answer: "Le plan gratuit inclut un nombre limité d'analyses et de suivis. Vous pouvez acheter des crédits pour débloquer plus d'analyses, plus de candidatures suivies et, à terme, des analyses plus longues."
    },
    {
      question: "Le service est-il vraiment gratuit ?",
      answer: "Oui. Vous pouvez utiliser ScanIt gratuitement pour analyser votre CV et suivre vos candidatures avec un quota généreux. Plus tard, vous pourrez, si vous le souhaitez, étendre ces limites grâce à des crédits optionnels, sans engagement."
    },
    {
      question: "Les recommandations sont-elles compatibles ATS ?",
      answer: "Oui. Nous simulons la lecture d'un ATS pour détecter mots-clés, structure et lisibilité, puis nous suggérons des améliorations concrètes."
    },
    {
      question: "Les futures améliorations prévues ?",
      answer: "Nous envisageons plus de jetons pour des analyses plus longues, des rapports détaillés et d'autres avantages pour les comptes avec crédits."
    }
  ];

  const AccordionItem = ({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<string | number>(0);

    useLayoutEffect(() => {
      const content = contentRef.current;
      const wrapper = wrapperRef.current;
      if (!content || !wrapper) return;

      if (isOpen) {
        const target = content.scrollHeight;
        setHeight(target);
        const onEnd = () => setHeight('auto');
        wrapper.addEventListener('transitionend', onEnd, { once: true });
      } else {
        const current = content.scrollHeight;
        // Si on était en auto, fixe la hauteur puis déclenche l'animation vers 0 au frame suivant
        setHeight(current);
        requestAnimationFrame(() => setHeight(0));
      }
    }, [isOpen]);

    return (
      <div className="mb-2 border-b border-gray-200">
        <button
          className="flex justify-between items-center w-full text-left font-medium text-lg py-4 focus:outline-none"
          onClick={onToggle}
        >
          <span className="text-secondary">{item.question}</span>
          <FiChevronDown className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div ref={wrapperRef} style={{ height, transition: 'height 300ms ease' }} className="overflow-hidden">
          <div ref={contentRef} className="pb-4 text-gray-600">
            {item.answer}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="faq" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-4">Questions fréquentes</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur l'analyse de CV, le suivi des candidatures et les crédits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openItems.has(index)}
              onToggle={() => toggleAccordion(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 