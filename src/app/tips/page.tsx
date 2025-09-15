export const metadata = {
  title: 'Tips | ScanIt',
  description: '10 tips essentiels, du CV à l’entretien, avec filtres par thème.',
};

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TipsClient from './TipsClient';

export default function TipsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <section className="bg-secondary text-white">
        <div className="container py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Tips</h1>
          <p className="mt-2 text-white/80 max-w-2xl">Filtrez par thème pour afficher uniquement les conseils qui vous intéressent.</p>
        </div>
      </section>
      <main className="container flex-1 py-12">
        <TipsClient />
      </main>
      <Footer />
    </div>
  );
}
