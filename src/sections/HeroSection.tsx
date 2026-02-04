import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NodeGraphic } from '@/components/NodeGraphic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const node = nodeRef.current;

    if (!section || !content || !node) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      loadTl
        .fromTo(node, 
          { opacity: 0, scale: 0.85 }, 
          { opacity: 1, scale: 1, duration: 1.2 }
        )
        .fromTo(content.querySelectorAll('.hero-animate'), 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 
          '-=0.7'
        );

      // Scroll-driven exit
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=40%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          onLeaveBack: () => {
            gsap.set([node, ...content.querySelectorAll('.hero-animate')], {
              opacity: 1, y: 0, x: 0, scale: 1
            });
          },
        },
      });

      // EXIT (0-100%)
      scrollTl
        .fromTo(content,
          { y: 0, opacity: 1 },
          { y: '-15vh', opacity: 0, ease: 'power2.in' },
          0
        )
        .fromTo(node,
          { scale: 1, opacity: 1 },
          { scale: 0.9, opacity: 0.3, ease: 'power2.in' },
          0
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
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[80vh] flex items-center overflow-hidden z-10"
      style={{ backgroundColor: '#07080A' }}
    >
      {/* Large background node */}
      <div
        ref={nodeRef}
        className="absolute pointer-events-none"
        style={{
          right: '-15vw',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <NodeGraphic 
          size={Math.min(window.innerWidth * 0.7, 900)} 
          intensity="high"
        />
      </div>

      {/* Content container */}
      <div 
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16"
      >
        <div className="max-w-3xl">
          {/* Text content */}
          <div className="space-y-8">
            <div className="hero-animate space-y-2">
              <p className="text-indigo-glow font-medium tracking-wide text-base uppercase">
                AI Language Partner
              </p>
              <h1 className="font-heading font-bold text-6xl sm:text-7xl lg:text-8xl text-white leading-[0.95]">
                Don't study.<br />
                <span className="text-indigo-glow">Just Speak.</span>
              </h1>
            </div>

            <p className="hero-animate text-xl text-text-secondary max-w-lg leading-relaxed">
              The conversational engine that helps you learn languages naturally.
              No flashcards, no drills, just real talk.
            </p>

            <div className="hero-animate flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-indigo-glow hover:bg-indigo-light text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:shadow-glow-lg flex items-center gap-2"
                onClick={() => scrollToSection('memory')}
              >
                Try the Demo
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full font-medium text-base flex items-center gap-2"
                onClick={() => scrollToSection('cta')}
              >
                <Play size={18} />
                Join the Waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07080A] to-transparent pointer-events-none" />
    </section>
  );
}

export default HeroSection;
