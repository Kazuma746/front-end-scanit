'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

interface UserData {
  username: string;
  firstName: string;
  lastName: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement du composant
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      // Appel à l'API de déconnexion
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Supprimer les données de l'utilisateur du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Réinitialiser l'état
      setUser(null);
      
      // Fermer le dropdown
      setIsDropdownOpen(false);
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-secondary">ScanIt</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="font-medium hover:text-primary transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#faq" className="font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link href="/pricing" className="font-medium hover:text-primary transition-colors">
            Tarifs
          </Link>
          <Link href="/contact" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-2 font-medium bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                <span>{user.username || `${user.firstName} ${user.lastName}`}</span>
                <FiUser />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon profil
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Tableau de bord
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <FiLogOut />
                      <span>Déconnexion</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn-secondary">
              Se connecter
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-secondary focus:outline-none" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-40">
          <nav className="container py-4 flex flex-col space-y-4">
            <Link 
              href="#features" 
              className="font-medium p-2 hover:bg-gray-100 rounded-md" 
              onClick={toggleMenu}
            >
              Fonctionnalités
            </Link>
            <Link 
              href="#faq" 
              className="font-medium p-2 hover:bg-gray-100 rounded-md" 
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <Link 
              href="/pricing" 
              className="font-medium p-2 hover:bg-gray-100 rounded-md" 
              onClick={toggleMenu}
            >
              Tarifs
            </Link>
            <Link 
              href="/contact" 
              className="font-medium p-2 hover:bg-gray-100 rounded-md" 
              onClick={toggleMenu}
            >
              Contact
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="font-medium p-2 hover:bg-gray-100 rounded-md" 
                  onClick={toggleMenu}
                >
                  Mon profil
                </Link>
                <Link 
                  href="/dashboard" 
                  className="font-medium p-2 hover:bg-gray-100 rounded-md" 
                  onClick={toggleMenu}
                >
                  Tableau de bord
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="font-medium p-2 hover:bg-gray-100 rounded-md text-left w-full flex items-center space-x-2"
                >
                  <FiLogOut />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="btn-secondary text-center" 
                onClick={toggleMenu}
              >
                Se connecter
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 