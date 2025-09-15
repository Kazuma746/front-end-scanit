import Link from 'next/link';
import { FiInstagram, FiTwitter, FiLinkedin, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4">ScanIt</h2>
            <p className="text-gray-300 mb-4">
              Analyse de CV compatible ATS et suivi de candidatures. Commencez gratuitement, ajoutez des crédits pour plus d’avantages.
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-lg font-medium mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-300 hover:text-primary transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-300 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-primary transition-colors">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tips" className="text-gray-300 hover:text-primary transition-colors">
                  Tips
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Restez informé</h3>
            <p className="text-gray-300 mb-4">
              Abonnez-vous à notre newsletter pour recevoir nos dernières actualités.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-dark"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-opacity-90 transition-colors px-4 py-2 rounded-r-md"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright et Réseaux Sociaux */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} ScanIt. Tous droits réservés.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FiLinkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <FiFacebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 