'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiFileText } from 'react-icons/fi';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import UserButton from './ui/UserButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Rendu initial côté serveur
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-secondary">ScanIt</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <div className="w-[120px] h-[40px] bg-gray-200 animate-pulse rounded-md"></div>
          </nav>
          <button className="md:hidden p-2 text-secondary focus:outline-none">
            <FiMenu size={24} />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-secondary">ScanIt</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && (
            <Link 
              href="/analyze"
              className="flex items-center space-x-2 font-medium hover:text-primary transition-colors"
              title="Analyser un CV"
            >
              <FiFileText className="w-5 h-5" />
              <span>Analyser</span>
            </Link>
          )}
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
            isLoading={isLoading}
            onLogout={handleLogout}
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
            {user && (
              <Link 
                href="/analyze"
                className="flex items-center space-x-2 font-medium hover:text-primary transition-colors px-2 py-2"
                onClick={toggleMenu}
              >
                <FiFileText className="w-5 h-5" />
                <span>Analyser un CV</span>
              </Link>
            )}
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
              isLoading={isLoading}
              onLogout={() => {
                handleLogout();
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