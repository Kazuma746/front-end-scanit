import { ReactNode } from 'react';

interface AuthButtonProps {
  type?: 'submit' | 'button';
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

const AuthButton = ({
  type = 'button',
  disabled = false,
  onClick,
  children,
  isLoading = false,
  className = ''
}: AuthButtonProps) => {
  const baseClasses = 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors';
  
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? 'Chargement...' : children}
    </button>
  );
};

export default AuthButton; 