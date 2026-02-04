import { useRef, useLayoutEffect, useState } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NodeGraphic } from '@/components/NodeGraphic';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const body = new URLSearchParams(new FormData(form) as any);
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    setSubmitted(true);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const node = nodeRef.current;

    if (!section || !content || !node) return;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(content.querySelectorAll('.cta-animate'),
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

      // Node animation
      gsap.fromTo(node,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
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
      id="cta"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#07080A' }}
    >
      {/* Large centered node */}
      <div
        ref={nodeRef}
        className="absolute pointer-events-none opacity-40"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <NodeGraphic 
          size={800} 
          intensity="high"
        />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center"
      >
        <h2 className="cta-animate font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-[1.05]">
          Start your first<br />conversation today.
        </h2>

        <p className="cta-animate text-lg text-text-secondary mb-10 max-w-xl mx-auto">
          Join thousands of learners who are mastering languages through natural conversation.
        </p>

        {submitted ? (
          <div className="cta-animate flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check size={28} className="text-emerald-400" />
            </div>
            <p className="text-lg text-white font-medium">You're on the list.</p>
            <p className="text-sm text-text-secondary">We'll be in touch when it's ready.</p>
          </div>
        ) : (
          <>
            <form
              className="cta-animate flex flex-col sm:flex-row gap-4 justify-center items-stretch"
              name="waitlist"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="waitlist" />
              <input type="hidden" name="bot-field" />
              <label className="sr-only" htmlFor="waitlist-email">Email</label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full sm:w-80 rounded-full bg-white/10 border border-white/15 px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-glow/60"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-indigo-glow hover:bg-indigo-light text-white px-8 py-6 rounded-full font-medium text-base transition-all hover:shadow-glow-lg flex items-center justify-center gap-2"
              >
                Join the Waitlist
                <ArrowRight size={20} />
              </Button>
            </form>

            <div className="cta-animate flex justify-center mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2"
                onClick={() => {
                  window.location.href = '/contact.html';
                }}
              >
                <Mail size={16} />
                Contact for Teams
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CTASection;
