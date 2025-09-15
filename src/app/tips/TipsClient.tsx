'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Tip = {
  id: number;
  category: 'CV' | 'Lettre' | 'Profil' | 'ATS' | 'Recherche' | 'STAR' | 'Questions' | 'Présentation' | 'Stress' | 'Suivi';
  title: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
};

const tipsData: Tip[] = [
  { id: 1, category: 'CV', title: 'Personnalisez votre CV pour chaque offre', description: "Adaptez l’intitulé, le résumé et les expériences aux mots-clés et attentes de l’annonce.", sourceLabel: 'WTTJ – CV (dossier)', sourceUrl: 'https://www.welcometothejungle.com/fr/tags/cv' },
  { id: 2, category: 'Lettre', title: 'Rédigez une lettre de motivation ciblée', description: "Expliquez votre valeur ajoutée pour l’entreprise et illustrez par des exemples concrets.", sourceLabel: 'APEC – Optimiser votre candidature', sourceUrl: 'https://www.apec.fr/candidat/optimiser-votre-candidature.html' },
  { id: 3, category: 'Profil', title: 'Optimisez votre présence en ligne (LinkedIn)', description: "Titre clair, résumé orienté impact, mots-clés du secteur et réalisations mesurables.", sourceLabel: 'WTTJ – Optimiser son profil LinkedIn', sourceUrl: 'https://www.welcometothejungle.com/fr/articles/optimiser-profil-linkedin-trouver-emploi' },
  { id: 4, category: 'ATS', title: 'Structure compatible ATS', description: "Misez sur une mise en forme simple, libellés standards et mots-clés pertinents.", sourceLabel: 'WTTJ – CV (dossier)', sourceUrl: 'https://www.welcometothejungle.com/fr/tags/cv' },
  { id: 5, category: 'Recherche', title: 'Renseignez-vous sur l’entreprise', description: "Mission, produits, valeurs, actualités : montrez que votre candidature est informée.", sourceLabel: 'WTTJ – Entretien (dossier)', sourceUrl: 'https://www.welcometothejungle.com/fr/tags/entretien' },
  { id: 6, category: 'STAR', title: 'Préparez des réponses avec la méthode STAR', description: "Situation, Tâche, Action, Résultat : illustrez vos compétences par des cas mesurables.", sourceLabel: 'WTTJ – Bien préparer son entretien', sourceUrl: 'https://www.welcometothejungle.com/fr/articles/conseils-preparer-entretien-embauche' },
  { id: 7, category: 'Questions', title: 'Listez des questions pertinentes à poser', description: "Mission, priorités, KPIs, outils, culture : poser des questions montre votre engagement.", sourceLabel: 'WTTJ – Questions à poser', sourceUrl: 'https://www.welcometothejungle.com/fr/articles/entretien-embauche-questions-a-poser' },
  { id: 8, category: 'Présentation', title: 'Soignez votre présentation et votre timing', description: "Tenue adaptée, ponctualité, écoute active et réponses concises.", sourceLabel: 'WTTJ – Bien préparer son entretien', sourceUrl: 'https://www.welcometothejungle.com/fr/articles/conseils-preparer-entretien-embauche' },
  { id: 9, category: 'Stress', title: 'Gérez le stress avant et pendant l’entretien', description: "Respiration, reformulation, silences maîtrisés : gardez le cap.", sourceLabel: 'WTTJ – Bien préparer son entretien', sourceUrl: 'https://www.welcometothejungle.com/fr/articles/conseils-preparer-entretien-embauche' },
  { id: 10, category: 'Suivi', title: 'Envoyez un message de remerciement', description: "Réaffirmez votre motivation et proposez de fournir des éléments complémentaires.", sourceLabel: 'WTTJ – Entretien (dossier)', sourceUrl: 'https://www.welcometothejungle.com/fr/tags/entretien' },
];

const categoryOrder: Tip['category'][] = ['CV', 'Lettre', 'Profil', 'ATS', 'Recherche', 'STAR', 'Questions', 'Présentation', 'Stress', 'Suivi'];

export default function TipsClient() {
  const [selected, setSelected] = useState<Set<Tip['category']>>(new Set());

  const categories = useMemo(() => categoryOrder.filter(cat => tipsData.some(t => t.category === cat)), []);

  const filteredTips = useMemo(() => {
    if (selected.size === 0) return tipsData;
    return tipsData.filter(t => selected.has(t.category));
  }, [selected]);

  const [clickKey, setClickKey] = useState<number>(0);
  const toggleCategory = (cat: Tip['category']) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
    // force une clé de réanimation de la grille
    setClickKey(k => k + 1);
  };

  const clearFilters = () => setSelected(new Set());

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={clearFilters} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${selected.size === 0 ? 'bg-secondary text-white border-secondary' : 'bg-white text-secondary border-gray-200 hover:border-secondary'}`}>Tout</button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.classList.add('animate-filter-bounce');
              setTimeout(() => {
                // Vérifie que l'élément est toujours monté
                if (el && el.classList) {
                  el.classList.remove('animate-filter-bounce');
                }
              }, 220);
              toggleCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${selected.has(cat) ? 'bg-primary text-white border-primary' : 'bg-white text-dark border-gray-200 hover:border-primary'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div key={clickKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-list-fade-in">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-dark">{tip.category}</span>
              <Link href={tip.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:text-primary underline underline-offset-2">Source</Link>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">{tip.title}</h3>
            <p className="text-black/80 leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-secondary">Mettez ces tips en action</h2>
          <p className="text-gray-600 mt-1">Analysez votre CV et obtenez des recommandations compatibles ATS.</p>
        </div>
        <Link href="/analyze" className="btn-primary mt-4 md:mt-0 w-full md:w-auto text-center">Analyser mon CV</Link>
      </div>
    </div>
  );
}


