import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-secondary to-dark text-white py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Analysez votre CV et <span className="text-primary">suivez vos candidatures</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Recommandations compatibles ATS et suivi de candidatures centralisé. Commencez gratuitement, puis ajoutez des crédits si besoin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/analyze" className="btn-primary text-center">
                Analyser mon CV
              </Link>
              <Link href="#features" className="bg-transparent border-2 border-white hover:border-primary hover:text-primary transition-colors duration-300 px-6 py-3 rounded-md text-white font-medium text-center">
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-[400px]">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-dark rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg p-8 relative z-10 backdrop-blur-sm bg-opacity-30 border border-white border-opacity-20">
                  <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="h-2 w-24 bg-primary rounded mb-3"></div>
                    <div className="h-2 w-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="h-2 w-28 bg-secondary rounded mb-3"></div>
                    <div className="h-2 w-36 bg-gray-200 rounded mb-3"></div>
                    <div className="h-2 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="h-2 w-20 bg-secondary rounded mb-3"></div>
                    <div className="h-2 w-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-2 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 