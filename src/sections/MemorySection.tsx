import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NodeGraphic } from '@/components/NodeGraphic';
import { LegacyChatGraph } from '@/components/LegacyChatGraph';
import { Zap, Globe, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function MemorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const node = nodeRef.current;

    if (!section || !content || !node) return;

    const ctx = gsap.context(() => {
      // Content fade in
      gsap.fromTo(content.querySelectorAll('.memory-animate'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.5,
          },
        }
      );

      // Node parallax
      gsap.to(node, {
        y: -60,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="memory"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ backgroundColor: '#07080A' }}
    >
      {/* Background node */}
      <div
        ref={nodeRef}
        className="absolute pointer-events-none opacity-40"
        style={{
          right: '-20vw',
          top: '10%',
        }}
      >
        <NodeGraphic 
          size={800} 
          intensity="medium"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="memory-animate text-indigo-glow font-medium tracking-wide text-sm uppercase mb-4">
            Your Progress
          </p>
          <h2 className="memory-animate font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
            Never forget a word.
          </h2>
          <p className="memory-animate text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            We leverage top cognitive research to help you learn words with the least amount of time. 
            Our spaced repetition algorithm adapts to your memory, showing you words exactly when 
            you are about to forget them.
          </p>
        </div>

        {/* Chat + Node Graph side by side */}
        <LegacyChatGraph />

        {/* Feature highlights */}
        <div className="memory-animate grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-indigo-glow mx-auto mb-3" />
            <p className="text-lg font-heading font-bold text-white mb-1">Start instantly</p>
            <p className="text-sm text-text-secondary">No account or downloads. Open a browser and go.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <Globe className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <p className="text-lg font-heading font-bold text-white mb-1">7 languages</p>
            <p className="text-sm text-text-secondary">Native speech out of the box. More languages on the cloud version.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-lg font-heading font-bold text-white mb-1">Adapts to you</p>
            <p className="text-sm text-text-secondary">Conversations adjust to your level and vocabulary in real time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MemorySection;
