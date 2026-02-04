import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    question: 'Which languages are supported?',
    answer:
      'We focus on conversational fluency for major languages including English, Spanish, French, German, Mandarin, Japanese, and more. New languages are added regularly based on user demand.',
  },
  {
    question: 'How does the memory model work?',
    answer:
      'LingLang uses a node-based cognitive architecture that tracks your vocabulary, mistakes, and learning goals. It builds a living model of your knowledge and adapts every conversation to reinforce weak areas and introduce new concepts at the right pace.',
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes. You get daily sessions and core features at no cost. Premium plans unlock unlimited conversations, advanced analytics, and personalized learning paths.',
  },
  {
    question: 'Can I use it on mobile?',
    answer:
      'Absolutely. The experience is built for phone, desktop, and tablet. Your progress syncs seamlessly across all devices.',
  },
  {
    question: 'How is my data used?',
    answer:
      'Your conversation data is used only to improve your personal learning model. We never sell data to third parties, and you can export or delete your data at any time.',
  },
  {
    question: 'Can I self-host LingLang?',
    answer:
      'Yes! LingLang is open-source and we provide a Docker image for self-hosting. This gives you full control over your data and the ability to customize the learning experience.',
  },
];

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const accordion = accordionRef.current;

    if (!section || !title || !accordion) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(title,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.5,
          },
        }
      );

      // Accordion items animation
      const items = accordion.querySelectorAll('[data-faq-item]');
      gsap.fromTo(items,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: accordion,
            start: 'top 85%',
            end: 'top 50%',
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
      id="faq"
      className="relative grain-overlay py-24 md:py-32"
      style={{ backgroundColor: '#0E1116', zIndex: 60 }}
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <h2
          ref={titleRef}
          className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-12"
        >
          FAQ
        </h2>

        <div ref={accordionRef}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                data-faq-item
                className="border border-white/10 rounded-xl px-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <AccordionTrigger className="text-left font-heading font-medium text-text-primary py-5 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
