import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
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
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#07080A]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="font-heading font-bold text-xl text-white tracking-tight hover:text-indigo-glow transition-colors"
          >
            LingLang
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('memory')}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('self-hosted')}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              Self-Hosted
            </button>
            <Button
              onClick={() => scrollToSection('cta')}
              className="bg-indigo-glow hover:bg-indigo-light text-white text-sm px-5 py-2 rounded-full transition-all hover:shadow-glow"
            >
              Get Notified
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#07080A]/98 backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <button
              onClick={() => scrollToSection('memory')}
              className="text-2xl font-heading text-white hover:text-indigo-glow transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('self-hosted')}
              className="text-2xl font-heading text-white hover:text-indigo-glow transition-colors"
            >
              Self-Hosted
            </button>
            <Button
              onClick={() => scrollToSection('cta')}
              className="bg-indigo-glow hover:bg-indigo-light text-white text-lg px-8 py-3 rounded-full mt-4"
            >
              Get Notified
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
