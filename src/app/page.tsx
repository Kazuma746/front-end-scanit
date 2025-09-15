import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Link from 'next/link';
import Image from 'next/image';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      {/* Section Conseils avant la FAQ */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-secondary mb-4">Conseils & bonnes pratiques</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              10 conseils concrets, du CV à l’entretien, pour booster vos candidatures et réussir vos échanges.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-semibold text-dark">Découvrez nos 10 conseils clés</h3>
              <p className="text-gray-600 mt-1">Sources incluses. Mise en forme claire et actions pratiques.</p>
              <Link href="/tips" className="btn-secondary mt-4 inline-block text-center">
                Voir les tips
              </Link>
            </div>
            <div className="relative w-full h-56 md:h-48 lg:h-56 rounded-lg overflow-hidden shadow-sm">
              <Image
                src="/img/curriculum.jpg"
                alt="Illustration CV et graphiques"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </main>
  );
}
