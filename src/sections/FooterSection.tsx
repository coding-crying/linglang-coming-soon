import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Twitter, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={sectionRef}
      className="relative py-16 lg:py-20 border-t border-white/10"
      style={{ backgroundColor: '#07080A' }}
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12">
          {/* Logo & tagline */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-white mb-2">
              LingLang
            </h3>
            <p className="text-text-secondary text-sm">
              The open-source conversational engine.
            </p>
            <p className="text-text-secondary/60 text-xs mt-1">
              MIT Licensed.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-8">
            <button
              onClick={() => scrollToSection('memory')}
              className="text-text-secondary hover:text-white text-sm transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('self-hosted')}
              className="text-text-secondary hover:text-white text-sm transition-colors"
            >
              Self-Hosted
            </button>
            <a
              href="/privacy.html"
              className="text-text-secondary hover:text-white text-sm transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms.html"
              className="text-text-secondary hover:text-white text-sm transition-colors"
            >
              Terms
            </a>
            <a
              href="/contact.html"
              className="text-text-secondary hover:text-indigo-glow text-sm transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-all"
            >
              <Github size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-all"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-all"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-text-secondary/40 text-sm">
            © 2026 LingLang Labs.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
