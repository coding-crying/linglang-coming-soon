import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NodeGraphic } from '@/components/NodeGraphic';

gsap.registerPlugin(ScrollTrigger);

interface FeatureSectionProps {
  id: string;
  microLabel: string;
  headline: string;
  supporting: string;
  nodePosition: 'left' | 'right';
  zIndex: number;
}

export function FeatureSection({
  id,
  microLabel,
  headline,
  supporting,
  nodePosition,
  zIndex,
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const microRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);

  const isNodeLeft = nodePosition === 'left';

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const node = nodeRef.current;
    const micro = microRef.current;
    const headlineEl = headlineRef.current;
    const supporting = supportingRef.current;

    if (!section || !node || !micro || !headlineEl || !supporting) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Node animation
      const nodeStartX = isNodeLeft ? '-60vw' : '60vw';
      const nodeExitX = isNodeLeft ? '-18vw' : '18vw';

      scrollTl
        // ENTRANCE (0-30%)
        .fromTo(node,
          { x: nodeStartX, opacity: 0, scale: 0.85 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        )
        // SETTLE (30-70%): hold
        // EXIT (70-100%)
        .fromTo(node,
          { x: 0, opacity: 1 },
          { x: nodeExitX, opacity: 0, ease: 'power2.in' },
          0.7
        );

      // Headline animation
      const textStartX = isNodeLeft ? '40vw' : '-40vw';
      const textExitX = isNodeLeft ? '18vw' : '-18vw';

      scrollTl
        // ENTRANCE (5-30%)
        .fromTo(headlineEl,
          { x: textStartX, opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.05
        )
        // EXIT (70-100%)
        .fromTo(headlineEl,
          { x: 0, opacity: 1 },
          { x: textExitX, opacity: 0, ease: 'power2.in' },
          0.7
        );

      // Micro + Supporting animation
      scrollTl
        // ENTRANCE (10-30%)
        .fromTo([micro, supporting],
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.1
        )
        // EXIT (70-100%)
        .fromTo([micro, supporting],
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.75
        );
    }, section);

    return () => ctx.revert();
  }, [isNodeLeft]);

  const nodeLeft = isNodeLeft ? '28vw' : '72vw';
  const textLeft = isNodeLeft ? '62vw' : '10vw';
  const textWidth = isNodeLeft ? '34vw' : '36vw';
  const textMaxWidth = isNodeLeft ? 420 : 460;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="section-pinned grain-overlay"
      style={{ zIndex }}
    >
      {/* Node Graphic */}
      <div
        ref={nodeRef}
        className="absolute"
        style={{
          left: nodeLeft,
          top: '54vh',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <NodeGraphic 
          size={Math.min(window.innerWidth * 0.44, 560)} 
          intensity="medium"
        />
      </div>

      {/* Micro Label */}
      <div
        ref={microRef}
        className="absolute micro-label"
        style={{
          left: textLeft,
          top: '38vh',
          maxWidth: textMaxWidth,
        }}
      >
        {microLabel}
      </div>

      {/* Headline */}
      <h2
        ref={headlineRef}
        className="absolute font-heading font-semibold text-section text-text-primary"
        style={{
          left: textLeft,
          top: '46vh',
          transform: 'translateY(-50%)',
          width: `min(${textWidth}, ${textMaxWidth}px)`,
          lineHeight: 1.05,
        }}
      >
        {headline}
      </h2>

      {/* Supporting Text */}
      <p
        ref={supportingRef}
        className="absolute text-text-secondary text-sm md:text-base leading-relaxed"
        style={{
          left: textLeft,
          top: '62vh',
          width: `min(${isNodeLeft ? '30vw' : '32vw'}, ${isNodeLeft ? 380 : 400}px)`,
        }}
      >
        {supporting}
      </p>
    </section>
  );
}

export default FeatureSection;
