import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

type NavigationProps = {
  onOpenNotify: (source?: string) => void;
};

export function Navigation({ onOpenNotify }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }

    window.location.href = `/#${id}`;
  };

  return (
    <>
      <nav className={`site-nav ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-inner">
          <button
            onClick={() => scrollToSection('hero')}
            className="nav-brand"
          >
            LingLang.app
          </button>

          <div className="nav-menu">
            <button
              type="button"
              onClick={() => scrollToSection('demo')}
            >
              Demo
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('platform')}
            >
              Paths
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('research')}
            >
              Research
            </button>
            <button
              className="button primary"
              type="button"
              onClick={() => onOpenNotify('nav')}
            >
              Notify me <ArrowRight size={15} />
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="nav-toggle"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            <button
              type="button"
              onClick={() => scrollToSection('demo')}
            >
              Demo
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('platform')}
            >
              Paths
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('access')}
            >
              Beta
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onOpenNotify('mobile-nav');
              }}
            >
              Notify me
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
