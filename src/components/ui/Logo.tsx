import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  as?: 'link' | 'span';
}

const Logo = ({ className = '', size = 'md', as = 'link' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const logoElement = (
    <span className={`font-bold text-secondary ${sizeClasses[size]} ${className}`}>
      ScanIt
    </span>
  );

  if (as === 'link') {
    return (
      <Link href="/" className="flex items-center space-x-2">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default Logo; 