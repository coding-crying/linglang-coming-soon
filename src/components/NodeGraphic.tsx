import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface NodeGraphicProps {
  size?: number;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function NodeGraphic({ size = 600, className = '', intensity = 'medium' }: NodeGraphicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const glowIntensity = {
    low: '0 20px 80px rgba(79, 70, 229, 0.2)',
    medium: '0 30px 120px rgba(79, 70, 229, 0.35)',
    high: '0 40px 160px rgba(79, 70, 229, 0.5)',
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Subtle floating animation for the entire node
    gsap.to(containerRef.current, {
      y: -12,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Ring rotation
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 25,
        ease: 'none',
        repeat: -1,
      });
    }

    // Satellite orbit
    if (satelliteRef.current) {
      gsap.to(satelliteRef.current, {
        rotation: -360,
        duration: 18,
        ease: 'none',
        repeat: -1,
      });
    }

    // Particle drift
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      Array.from(particles).forEach((particle, i) => {
        gsap.to(particle, {
          x: `random(-40, 40)`,
          y: `random(-40, 40)`,
          duration: 5 + i * 0.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow halo - much larger */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 65%)',
          transform: 'scale(2.2)',
        }}
      />

      {/* Secondary glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 55%)',
          transform: 'scale(3)',
        }}
      />

      {/* Tertiary subtle glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 50%)',
          transform: 'scale(4)',
        }}
      />

      {/* Particles container - more particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-glow/70"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              boxShadow: '0 0 12px rgba(79, 70, 229, 0.9)',
            }}
          />
        ))}
      </div>

      {/* Main planet - larger relative to container */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background: 'radial-gradient(circle at 28% 28%, #818CF8 0%, #6366F1 25%, #4F46E5 50%, #3730A3 100%)',
          boxShadow: glowIntensity[intensity],
        }}
      >
        {/* Inner planet glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(129, 140, 248, 0.9) 0%, transparent 45%)',
          }}
        />
        {/* Planet surface highlight */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: '35%',
            height: '25%',
            left: '18%',
            top: '30%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            filter: 'blur(3px)',
          }}
        />
        {/* Secondary highlight */}
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: '20%',
            height: '15%',
            right: '25%',
            bottom: '35%',
            background: 'linear-gradient(-45deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Orbital ring container */}
      <div
        ref={ringRef}
        className="absolute inset-0"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Elliptical ring - thicker and more visible */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: size * 0.9,
            height: size * 0.38,
            border: '2px solid rgba(79, 70, 229, 0.5)',
            borderRadius: '50%',
            transform: 'rotateX(70deg) rotateZ(-15deg)',
            transformStyle: 'preserve-3d',
          }}
        />
        
        {/* Ring glow accent */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: size * 0.9,
            height: size * 0.38,
            border: '3px solid transparent',
            borderTop: '3px solid rgba(129, 140, 248, 0.7)',
            borderRadius: '50%',
            transform: 'rotateX(70deg) rotateZ(-15deg)',
            transformStyle: 'preserve-3d',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Satellite orbit container */}
      <div
        ref={satelliteRef}
        className="absolute inset-0"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Satellite dot - larger */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            left: '87%',
            top: '40%',
            background: 'radial-gradient(circle, #A5B4FC 0%, #818CF8 50%, #4F46E5 100%)',
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.9), 0 0 40px rgba(79, 70, 229, 0.5)',
          }}
        />
      </div>

      {/* Connection nodes around the planet */}
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60 + 30) * (Math.PI / 180);
        const x = 50 + Math.cos(angle) * 42;
        const y = 50 + Math.sin(angle) * 22;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-glow/60"
            style={{
              width: '4px',
              height: '4px',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(79, 70, 229, 0.8)',
            }}
          />
        );
      })}
    </div>
  );
}

export default NodeGraphic;
