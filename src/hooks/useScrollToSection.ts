import { useRouter } from 'next/navigation';

export const useScrollToSection = () => {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    // Si nous ne sommes pas sur la page d'accueil, rediriger d'abord
    if (window.location.pathname !== '/') {
      router.push('/');
      // Attendre que la navigation soit terminée
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si nous sommes déjà sur la page d'accueil, scroll directement
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return scrollToSection;
}; 