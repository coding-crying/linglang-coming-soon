import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  status: 'known' | 'learning' | 'new';
  connections: string[];
}

interface LiveNodeGraphProps {
  activeWordId?: string;
  className?: string;
}

export function LiveNodeGraph({ activeWordId, className = '' }: LiveNodeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());
  const [, setPulseKey] = useState(0);

  const nodes: Node[] = [
    { id: 'you', x: 50, y: 50, label: 'You', status: 'known', connections: ['exhausted', 'working', 'feel'] },
    { id: 'exhausted', x: 30, y: 25, label: 'Exhausted', status: 'learning', connections: ['bear'] },
    { id: 'working', x: 70, y: 30, label: 'Working', status: 'known', connections: ['hardly'] },
    { id: 'hardly', x: 75, y: 55, label: 'Hardly', status: 'learning', connections: ['grammar'] },
    { id: 'feel', x: 25, y: 60, label: 'Feel', status: 'known', connections: ['like'] },
    { id: 'like', x: 15, y: 45, label: 'Like', status: 'known', connections: [] },
    { id: 'bear', x: 45, y: 10, label: 'Bear', status: 'known', connections: [] },
    { id: 'grammar', x: 55, y: 80, label: 'Grammar', status: 'new', connections: [] },
    { id: 'day', x: 85, y: 35, label: 'Day', status: 'known', connections: [] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'known': return '#10B981';
      case 'learning': return '#F59E0B';
      case 'new': return '#6366F1';
      default: return '#6B7280';
    }
  };

  // Trigger pulse animation when active word changes
  useEffect(() => {
    if (activeWordId && nodeRefs.current.has(activeWordId)) {
      const nodeEl = nodeRefs.current.get(activeWordId);
      if (nodeEl) {
        const circle = nodeEl.querySelector('.node-core');
        const glow = nodeEl.querySelector('.node-glow');
        
        if (circle && glow) {
          gsap.fromTo(circle,
            { scale: 1 },
            { scale: 1.5, duration: 0.2, ease: 'back.out(2)' }
          );
          gsap.to(circle, {
            scale: 1,
            duration: 0.4,
            delay: 0.2,
            ease: 'power2.out',
          });
          
          gsap.fromTo(glow,
            { opacity: 0.3, r: 6 },
            { opacity: 0.8, r: 12, duration: 0.3, ease: 'power2.out' }
          );
          gsap.to(glow, {
            opacity: 0.3,
            r: 6,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out',
          });
        }
      }
    }
    setPulseKey(prev => prev + 1);
  }, [activeWordId]);

  // Floating animation
  useEffect(() => {
    if (!svgRef.current) return;

    nodeRefs.current.forEach((el, id) => {
      const delay = id.charCodeAt(0) % 5 * 0.3;
      gsap.to(el, {
        y: `random(-2, 2)`,
        x: `random(-1.5, 1.5)`,
        duration: 3 + Math.random() * 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });
    });
  }, []);

  // Generate connections
  const connections: { from: Node; to: Node; key: string }[] = [];
  nodes.forEach(node => {
    node.connections.forEach(connId => {
      const target = nodes.find(n => n.id === connId);
      if (target) {
        connections.push({ from: node, to: target, key: `${node.id}-${target.id}` });
      }
    });
  });

  const setNodeRef = useCallback((el: SVGGElement | null, id: string) => {
    if (el) {
      nodeRefs.current.set(id, el);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ filter: 'drop-shadow(0 0 30px rgba(79, 70, 229, 0.2))' }}
    >
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(79, 70, 229, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="nodeGlowFilter">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="50" cy="50" r="40" fill="url(#centerGlow)" />

      {/* Connection lines - drawn first so they appear behind nodes */}
      {connections.map((conn) => (
        <line
          key={conn.key}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke="rgba(79, 70, 229, 0.25)"
          strokeWidth="0.4"
        />
      ))}

      {/* Connection pulse animation for active word */}
      {activeWordId && connections
        .filter(c => c.from.id === activeWordId || c.to.id === activeWordId)
        .map((conn) => (
          <circle key={`pulse-${conn.key}`} r="1.5" fill="#4F46E5">
            <animateMotion
              dur="0.8s"
              repeatCount="1"
              path={`M ${conn.from.x} ${conn.from.y} L ${conn.to.x} ${conn.to.y}`}
            />
          </circle>
        ))}

      {/* Nodes */}
      {nodes.map((node) => {
        const isActive = node.id === activeWordId;
        const color = getStatusColor(node.status);
        
        return (
          <g
            key={node.id}
            ref={(el) => setNodeRef(el, node.id)}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {/* Outer glow ring */}
            <circle
              className="node-glow"
              cx={node.x}
              cy={node.y}
              r={isActive ? 10 : 5}
              fill={color}
              opacity={isActive ? 0.4 : 0.15}
              filter="url(#nodeGlowFilter)"
            />

            {/* Inner glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={isActive ? 6 : 3.5}
              fill={color}
              opacity={0.4}
            />

            {/* Core */}
            <circle
              className="node-core"
              cx={node.x}
              cy={node.y}
              r={isActive ? 3.5 : 2}
              fill={color}
              style={{ transformOrigin: 'center' }}
            />

            {/* Label */}
            <text
              x={node.x}
              y={node.y + (isActive ? 10 : 8)}
              textAnchor="middle"
              fill={isActive ? 'white' : 'rgba(255, 255, 255, 0.6)'}
              fontSize={isActive ? 4.5 : 3.5}
              fontFamily="Inter, sans-serif"
              fontWeight={isActive ? 500 : 400}
              style={{ transition: 'all 0.2s ease' }}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Subtle orbiting dots */}
      <circle r="0.8" fill="#4F46E5" opacity="0.5">
        <animateMotion
          dur="15s"
          repeatCount="indefinite"
          path="M 50 50 m -35 0 a 35,35 0 1,0 70 0 a 35,35 0 1,0 -70 0"
        />
      </circle>
      <circle r="0.6" fill="#6366F1" opacity="0.4">
        <animateMotion
          dur="20s"
          repeatCount="indefinite"
          path="M 50 50 m -28 0 a 28,28 0 1,0 56 0 a 28,28 0 1,0 -56 0"
          begin="2s"
        />
      </circle>
    </svg>
  );
}

export default LiveNodeGraph;
