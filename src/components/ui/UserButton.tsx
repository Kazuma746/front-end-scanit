'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import type { UserData } from '@/store/slices/authSlice';
import { MdVerifiedUser, MdWarning } from 'react-icons/md';

interface UserButtonProps {
  user: UserData | null;
  isLoading?: boolean;
  onLogout?: () => void;
  className?: string;
}

const UserButton = ({ user, isLoading = false, onLogout, className = '' }: UserButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (onLogout) {
        onLogout();
      }
      
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const baseButtonClasses = `min-w-[120px] h-[40px] flex items-center justify-center space-x-2 font-medium bg-secondary text-white px-4 py-2 rounded-md ${className}`;

  // Pendant le chargement ou avant l'hydratation, on affiche un bouton désactivé avec un effet de loading
  if (!mounted || isLoading) {
    return (
      <button 
        disabled
        className={`${baseButtonClasses} bg-opacity-70`}
      >
        <div className="w-16 h-4 bg-white/20 animate-pulse rounded"></div>
      </button>
    );
  }

  // Si on a des données utilisateur, on les affiche
  if (user?.userName) {
    return (
      <div className={`relative group ${className}`}>
        <button 
          onClick={toggleDropdown}
          className={`${baseButtonClasses} hover:bg-opacity-90 transition-colors`}
        >
          <FiUser className="w-5 h-5" />
          <span>{user.userName}</span>
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
    );
  }

  // Si pas de données utilisateur et pas en chargement, on affiche le bouton de connexion
  return (
    <Link 
      href="/auth/login" 
      className={`${baseButtonClasses} hover:bg-opacity-90 transition-colors text-center`}
    >
      Se connecter
    </Link>
  );
};

export default UserButton; 