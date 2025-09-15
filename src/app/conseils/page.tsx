export const metadata = {
  title: 'Conseils & bonnes pratiques | ScanIt',
  description: '10 conseils essentiels, du CV à l’entretien, avec sources fiables.',
};

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

type Tip = {
  id: number;
  category: 'CV' | 'Lettre' | 'Profil' | 'ATS' | 'Recherche' | 'STAR' | 'Questions' | 'Présentation' | 'Stress' | 'Suivi';
  title: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
};

const tips: Tip[] = [
  {
    id: 1,
    category: 'CV',
    title: 'Personnalisez votre CV pour chaque offre',
    description:
      "Adaptez l’intitulé, le résumé et les expériences aux mots-clés et attentes de l’annonce.",
    sourceLabel: 'Welcome to the Jungle – CV (dossier)',
    sourceUrl: 'https://www.welcometothejungle.com/fr/tags/cv',
  },
  {
    id: 2,
    category: 'Lettre',
    title: 'Rédigez une lettre de motivation ciblée',
    description:
      "Expliquez votre valeur ajoutée pour l’entreprise et illustrez par des exemples concrets.",
    sourceLabel: 'APEC – Optimiser votre candidature',
    sourceUrl: 'https://www.apec.fr/candidat/optimiser-votre-candidature.html',
  },
  {
    id: 3,
    category: 'Profil',
    title: 'Optimisez votre présence en ligne (LinkedIn)',
    description:
      "Titre clair, résumé orienté impact, mots-clés du secteur et réalisations mesurables.",
    sourceLabel: 'Welcome to the Jungle – Optimiser son profil LinkedIn',
    sourceUrl: 'https://www.welcometothejungle.com/fr/articles/optimiser-profil-linkedin-trouver-emploi',
  },
  {
    id: 4,
    category: 'ATS',
    title: 'Structure compatible ATS',
    description:
      "Misez sur une mise en forme simple, libellés standards (Expériences, Compétences) et mots-clés pertinents.",
    sourceLabel: 'Welcome to the Jungle – CV (dossier)',
    sourceUrl: 'https://www.welcometothejungle.com/fr/tags/cv',
  },
  {
    id: 5,
    category: 'Recherche',
    title: 'Renseignez-vous sur l’entreprise',
    description:
      "Mission, produits, valeurs, actualités : montrez que votre candidature est informée et motivée.",
    sourceLabel: 'Welcome to the Jungle – Entretien (dossier)',
    sourceUrl: 'https://www.welcometothejungle.com/fr/tags/entretien',
  },
  {
    id: 6,
    category: 'STAR',
    title: 'Préparez des réponses avec la méthode STAR',
    description:
      "Situation, Tâche, Action, Résultat : illustrez vos compétences par des cas mesurables.",
    sourceLabel: 'Welcome to the Jungle – Bien préparer son entretien',
    sourceUrl: 'https://www.welcometothejungle.com/fr/articles/conseils-preparer-entretien-embauche',
  },
  {
    id: 7,
    category: 'Questions',
    title: 'Listez des questions pertinentes à poser',
    description:
      "Mission, priorités, KPIs, outils, culture : poser des questions montre votre engagement.",
    sourceLabel: 'Welcome to the Jungle – Questions à poser en entretien',
    sourceUrl: 'https://www.welcometothejungle.com/fr/articles/entretien-embauche-questions-a-poser',
  },
  {
    id: 8,
    category: 'Présentation',
    title: 'Soignez votre présentation et votre timing',
    description:
      "Tenue adaptée, ponctualité, écoute active et réponses concises font une forte première impression.",
    sourceLabel: 'Welcome to the Jungle – Bien préparer son entretien',
    sourceUrl: 'https://www.welcometothejungle.com/fr/articles/conseils-preparer-entretien-embauche',
  },
  {
    id: 9,
    category: 'Stress',
    title: 'Gérez le stress avant et pendant l’entretien',
    description:
      "Respiration, reformulation, silences maîtrisés : gardez le cap et clarifiez si besoin.",
    sourceLabel: 'Welcome to the Jungle – Bien préparer son entretien',
    sourceUrl: 'https://www.welcometothejungle.com/fr/articles/conseils-preparer-entretien-embauche',
  },
  {
    id: 10,
    category: 'Suivi',
    title: 'Envoyez un message de remerciement',
    description:
      "Réaffirmez votre motivation, résumez votre valeur et proposez de fournir des éléments complémentaires.",
    sourceLabel: 'Welcome to the Jungle – Entretien (dossier)',
    sourceUrl: 'https://www.welcometothejungle.com/fr/tags/entretien',
  },
];

const categoryStyles: Record<Tip['category'], string> = {
  CV: 'bg-primary/10 text-primary',
  Lettre: 'bg-primary/10 text-primary',
  Profil: 'bg-secondary/10 text-secondary',
  ATS: 'bg-secondary/10 text-secondary',
  Recherche: 'bg-dark/10 text-dark',
  STAR: 'bg-dark/10 text-dark',
  Questions: 'bg-primary/10 text-primary',
  Présentation: 'bg-secondary/10 text-secondary',
  Stress: 'bg-dark/10 text-dark',
  Suivi: 'bg-primary/10 text-primary',
};

export default function ConseilsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-secondary text-white">
        <div className="container py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Conseils & bonnes pratiques</h1>
          <p className="mt-2 text-white/80 max-w-2xl">
            Dix conseils essentiels, du CV à l’entretien, pour booster votre candidature. Chaque astuce est accompagnée d’une source pour aller plus loin.
          </p>
        </div>
      </section>

      {/* Tips list */}
      <main className="container flex-1 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {tips.map((tip) => (
            <div key={tip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded ${categoryStyles[tip.category]}`}>
                  {tip.category}
                </span>
                <Link
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary hover:text-primary underline underline-offset-2"
                >
                  Source
                </Link>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">{tip.title}</h3>
              <p className="text-black/80 leading-relaxed mb-2">{tip.description}</p>
              <p className="text-xs text-gray-500">{tip.sourceLabel}</p>
            </div>
          ))}
        </div>

        {/* CTA bas de page */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary">Mettez ces conseils en action</h2>
            <p className="text-gray-600 mt-1">Analysez votre CV et obtenez des recommandations compatibles ATS.</p>
          </div>
          <Link href="/analyze" className="btn-primary mt-4 md:mt-0 w-full md:w-auto text-center">Analyser mon CV</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}


