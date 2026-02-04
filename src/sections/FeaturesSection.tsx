import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Brain, Zap, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: '01',
    title: 'Smart Conversations',
    description: 'The AI chats like a friend but adapts like a tutor. It remembers what you talked about yesterday and helps you build on it today.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Learn by Doing',
    description: 'Stop memorizing lists. Just speak, and we\'ll handle the grammar corrections and vocabulary tracking in the background.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Faster Fluency',
    description: 'Learning words in context is proven to be up to 12x more efficient than traditional study. It just sticks.',
    icon: Zap,
  },
  {
    number: '04',
    title: 'Any Content',
    description: 'Want to learn about cooking, tech, or travel? Teach LingLang any topic and it will guide you through conversations about it.',
    icon: BookOpen,
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(header.querySelectorAll('.header-animate'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.feature-card');
      gsap.fromTo(cardElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cards,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: '#07080A' }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-glow/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <p className="header-animate text-indigo-glow font-medium tracking-wide text-sm uppercase mb-4">
            Why LingLang?
          </p>
          <h2 className="header-animate font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white">
            Built for how you<br />actually learn.
          </h2>
        </div>

        {/* Feature cards */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="feature-card group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-indigo-glow/30 transition-all duration-300"
              >
                {/* Number */}
                <span className="absolute top-4 right-4 text-5xl font-heading font-bold text-white/5 group-hover:text-indigo-glow/10 transition-colors">
                  {feature.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-indigo-glow/20 flex items-center justify-center mb-5 group-hover:bg-indigo-glow/30 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-glow" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
