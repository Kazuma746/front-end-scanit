'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import UserButton from './ui/UserButton';

interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Vérifier que l'objet a la bonne structure
          if (typeof userData === 'object' && userData !== null && 'userName' in userData) {
            setUser(userData);
          } else {
            throw new Error('Format des données utilisateur invalide');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoadingUser(false);
    };

    // Petit délai pour éviter le flash du bouton de chargement si les données sont déjà en cache
    const timer = setTimeout(loadUser, 50);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-secondary">ScanIt</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')} 
            className="font-medium hover:text-primary transition-colors"
          >
            Fonctionnalités
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="font-medium hover:text-primary transition-colors"
          >
            FAQ
          </button>
          <Link href="/pricing" className="font-medium hover:text-primary transition-colors">
            Tarifs
          </Link>
          <Link href="/contact" className="font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          
          <UserButton 
            user={user}
            isLoading={isLoadingUser}
            onLogout={() => setUser(null)}
          />
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
            <button 
              onClick={() => {
                scrollToSection('features');
                toggleMenu();
              }} 
              className="font-medium p-2 hover:bg-gray-100 rounded-md text-left"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => {
                scrollToSection('faq');
                toggleMenu();
              }} 
              className="font-medium p-2 hover:bg-gray-100 rounded-md text-left"
            >
              FAQ
            </button>
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
            
            <UserButton 
              user={user}
              isLoading={isLoadingUser}
              onLogout={() => {
                setUser(null);
                toggleMenu();
              }}
              className="w-full"
            />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 