import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NodeGraphic } from '@/components/NodeGraphic';
import { Button } from '@/components/ui/button';
import { Container, Github, FileText, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SelfHostedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const node = nodeRef.current;
    const code = codeRef.current;

    if (!section || !content || !node || !code) return;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(content.querySelectorAll('.self-hosted-animate'),
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

      // Code block animation
      gsap.fromTo(code,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
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
      id="self-hosted"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#07080A' }}
    >
      {/* Background node */}
      <div
        ref={nodeRef}
        className="absolute pointer-events-none opacity-50"
        style={{
          right: '-15vw',
          bottom: '10%',
        }}
      >
        <NodeGraphic 
          size={600} 
          intensity="medium"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="self-hosted-animate">
              <p className="text-indigo-glow font-medium tracking-wide text-sm uppercase mb-4">
                Self-Hosted
              </p>
              <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
                Run it yourself.<br />
                <span className="text-text-secondary">Own your data.</span>
              </h2>
            </div>

            <p className="self-hosted-animate text-lg text-text-secondary leading-relaxed max-w-lg">
              LingLang is open-source and MIT licensed. Run it with your own API key,
              or use a local pipeline mode to avoid per-message API fees.
            </p>

            <div className="self-hosted-animate flex flex-wrap gap-4">
              <Button
                size="lg"
                disabled
                className="bg-white/10 text-white/50 px-6 py-5 rounded-full font-medium cursor-not-allowed flex items-center gap-2"
              >
                <Container size={20} />
                Docker Image
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Coming Soon</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-6 py-5 rounded-full font-medium flex items-center gap-2"
                onClick={() => {
                  window.location.href = '/request-access.html';
                }}
              >
                <Github size={20} />
                Join the Waitlist
              </Button>
            </div>

            {/* Links */}
            <div className="self-hosted-animate flex flex-wrap gap-6 pt-4">
              <a 
                href="/docs.html"
                className="text-text-secondary hover:text-indigo-glow text-sm flex items-center gap-2 transition-colors"
              >
                <FileText size={16} />
                Documentation
                <ArrowRight size={14} />
              </a>
              <a 
                href="/request-access.html"
                className="text-text-secondary hover:text-indigo-glow text-sm flex items-center gap-2 transition-colors"
              >
                Read the Research
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right: Code block */}
          <div ref={codeRef} className="relative">
            <div className="bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-4 text-xs text-text-secondary font-mono">terminal</span>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm">
                <p className="text-text-secondary mb-2">
                  <span className="text-indigo-glow">$</span> docker pull linglang/linglang
                </p>
                <p className="text-text-secondary mb-2">
                  <span className="text-indigo-glow">$</span> docker run -p 3000:3000 \
                </p>
                <p className="text-text-secondary mb-2 pl-4">
                  -e OPENAI_API_KEY=your_key \
                </p>
                <p className="text-text-secondary mb-4 pl-4">
                  linglang/linglang
                </p>
                <p className="text-emerald-400">
                  ✓ Server running on http://localhost:3000
                </p>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -inset-4 bg-indigo-glow/10 rounded-2xl blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelfHostedSection;
