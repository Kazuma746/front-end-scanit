import Link from 'next/link';

interface LogoWithTaglineProps {
  className?: string;
}

const LogoWithTagline = ({ className = '' }: LogoWithTaglineProps) => {
  return (
    <Link href="/" className={`block text-center ${className}`}>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold text-[#1B4B43] tracking-[0.2em]">
          SCAN<span className="text-[#1B4B43]">.</span>IT
        </span>
        <span className="text-gray-500 italic mt-4 text-base font-light tracking-wider">
          Votre job commence ici
        </span>
      </div>
    </Link>
  );
};

export default LogoWithTagline; 