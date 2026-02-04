import { useEffect, useRef } from 'react';

interface ScenarioSegment {
  role: 'ai' | 'user';
  text: string;
  isKeyword?: boolean;
  keywordId?: string;
  typeSpeed?: number;
  delay?: number;
}

const scenario: ScenarioSegment[] = [
  { role: 'ai', text: "You look like you've fought a bear." },
  { role: 'user', text: 'I feel like it. I have been working ', typeSpeed: 30 },
  {
    role: 'user',
    text: 'hardly',
    isKeyword: true,
    keywordId: 'hardly',
    typeSpeed: 80,
  },
  { role: 'user', text: ' all day.', typeSpeed: 30 },
  {
    role: 'ai',
    text: "If you were working 'hardly', the bear would have won.",
    typeSpeed: 30,
    delay: 1200,
  },
  { role: 'ai', text: ' You mean working hard.', typeSpeed: 30, delay: 300 },
  { role: 'user', text: 'Ha. Yes. I am absolutely ', typeSpeed: 30, delay: 800 },
  {
    role: 'user',
    text: 'exhausted',
    isKeyword: true,
    keywordId: 'exhausted',
    typeSpeed: 80,
  },
  { role: 'user', text: '.', typeSpeed: 30 },
  { role: 'ai', text: 'Then rest, warrior. The bear can wait.', typeSpeed: 30, delay: 800 },
];

export function LegacyChatGraph() {
  const rootRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const isCancelledRef = useRef(false);
  const isVisibleRef = useRef(false);
  const isRunningRef = useRef(false);

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      schedule(resolve, ms);
    });

  const typeText = (element: HTMLElement, text: string, speed: number) =>
    new Promise<void>((resolve) => {
      let i = 0;
      const tick = () => {
        if (isCancelledRef.current) return;
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i += 1;
          schedule(tick, speed);
        } else {
          resolve();
        }
      };
      tick();
    });

  const resetGraph = () => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>('.legacy-node.leaf, .legacy-node.memory, .legacy-node.trigger')
      .forEach((node) => {
        if (node.id === 'node-exhausted') {
          node.style.opacity = '1';
          node.classList.add('due');
        } else {
          node.style.opacity = '0';
        }
        node.style.setProperty('--node-scale', '1');
      });

    root.querySelectorAll<SVGLineElement>('.legacy-graph-lines line')
      .forEach((line) => {
        line.setAttribute('stroke-opacity', line.id === 'line-exhausted-root' ? '1' : '0');
      });
  };

  const revealConnection = (lineId: string) => {
    const line = document.getElementById(lineId);
    if (line) line.setAttribute('stroke-opacity', '1');
  };

  const revealLeaf = (nodeId: string, lineId: string) => {
    const node = document.getElementById(nodeId) as HTMLElement | null;
    const line = document.getElementById(lineId);
    if (line) line.setAttribute('stroke-opacity', '1');
    if (node) node.style.opacity = '1';
  };

  const activateGraphNode = (keywordId?: string) => {
    if (!keywordId) return;
    const triggerNode = document.getElementById(`node-${keywordId}`) as HTMLElement | null;
    if (!triggerNode) return;

    triggerNode.style.opacity = '1';
    triggerNode.style.setProperty('--node-scale', '1.08');

    if (keywordId === 'exhausted') {
      triggerNode.classList.remove('due');
    }

    schedule(() => {
      triggerNode.style.setProperty('--node-scale', '1');
    }, 300);

    if (keywordId === 'exhausted') {
      revealConnection('line-exhausted-root');
      schedule(() => revealLeaf('node-fatigue', 'line-fatigue-exhausted'), 400);
      schedule(() => revealLeaf('node-sleep', 'line-sleep-exhausted'), 800);
      schedule(() => revealLeaf('mem-exhausted', 'line-mem-exhausted'), 600);
    } else if (keywordId === 'hardly') {
      revealConnection('line-hardly-root');
      schedule(() => revealLeaf('node-grammar', 'line-grammar-hardly'), 400);
      schedule(() => revealLeaf('node-nuance', 'line-nuance-hardly'), 800);
      schedule(() => revealLeaf('mem-hardly', 'line-mem-hardly'), 600);
    }
  };

  const runScenario = async () => {
    if (!chatRef.current) return;

    chatRef.current.innerHTML = '';
    resetGraph();

    let currentBubble: HTMLDivElement | null = null;
    let currentTextContainer: HTMLSpanElement | null = null;

    for (const segment of scenario) {
      if (isCancelledRef.current) return;

      const isNewBubble = !currentBubble || currentBubble.dataset.role !== segment.role;

      if (segment.delay) {
        await wait(segment.delay);
      }

      if (isNewBubble) {
        currentBubble = document.createElement('div');
        currentBubble.className = `legacy-chat-bubble ${segment.role} visible`;
        currentBubble.dataset.role = segment.role;

        chatRef.current.appendChild(currentBubble);
        currentTextContainer = document.createElement('span');
        currentBubble.appendChild(currentTextContainer);
      }

      if (!currentTextContainer) continue;

      if (segment.isKeyword) {
        const span = document.createElement('span');
        span.className = 'legacy-vocab';
        currentTextContainer.appendChild(span);

        await typeText(span, segment.text, segment.typeSpeed || 50);
        activateGraphNode(segment.keywordId);
        span.classList.add('active');
      } else {
        const span = document.createElement('span');
        currentTextContainer.appendChild(span);
        await typeText(span, segment.text, segment.typeSpeed || 30);
      }
    }
  };

  const runScenarioLoop = async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    while (!isCancelledRef.current && isVisibleRef.current) {
      await runScenario();
      await wait(2600);
    }

    isRunningRef.current = false;
  };

  useEffect(() => {
    const target = rootRef.current;
    if (!target) return;

    isCancelledRef.current = false;
    isVisibleRef.current = true;
    schedule(runScenarioLoop, 400);

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        isVisibleRef.current = isVisible;
        if (isVisible) {
          schedule(runScenarioLoop, 300);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(target);

    return () => {
      isCancelledRef.current = true;
      observer.disconnect();
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div ref={rootRef} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-16">
      <div className="memory-animate">
        <div className="legacy-panel h-full min-h-[320px]">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Conversation
          </h3>
          <div ref={chatRef} className="legacy-chat-flow" />
        </div>
      </div>

      <div className="memory-animate">
        <div className="legacy-panel h-full min-h-[320px] flex flex-col">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-glow rounded-full animate-pulse" />
            Live Memory Model
          </h3>
          <div className="legacy-graph flex-1 relative">
            <div className="legacy-graph-canvas">
              <div className="legacy-node root" style={{ top: '50%', left: '50%' }}>You</div>

              <div className="legacy-node leaf" id="node-fatigue" style={{ top: '18%', left: '38%', opacity: 0 }}>Fatigue</div>
              <div className="legacy-node leaf" id="node-sleep" style={{ top: '32%', left: '14%', opacity: 0 }}>Sleep</div>
              <div className="legacy-node trigger due" id="node-exhausted" style={{ top: '35%', left: '34%', opacity: 1 }}>Exhausted</div>
              <div className="legacy-node memory" id="mem-exhausted" style={{ top: '48%', left: '24%', opacity: 0 }}>
                Strong<br />99%
              </div>

              <div className="legacy-node leaf" id="node-grammar" style={{ top: '76%', left: '74%', opacity: 0 }}>Grammar</div>
              <div className="legacy-node leaf" id="node-nuance" style={{ top: '84%', left: '50%', opacity: 0 }}>Nuance</div>
              <div className="legacy-node trigger" id="node-hardly" style={{ top: '62%', left: '68%', opacity: 0 }}>Hardly</div>
              <div className="legacy-node memory weak" id="mem-hardly" style={{ top: '46%', left: '72%', opacity: 0 }}>
                New<br />15%
              </div>

              <svg className="legacy-graph-lines" width="100%" height="100%">
                <line id="line-exhausted-root" x1="50%" y1="50%" x2="35%" y2="35%" strokeOpacity={1} />
                <line id="line-fatigue-exhausted" x1="35%" y1="35%" x2="40%" y2="20%" strokeOpacity={0} />
                <line id="line-sleep-exhausted" x1="35%" y1="35%" x2="20%" y2="30%" strokeOpacity={0} />
                <line id="line-mem-exhausted" x1="35%" y1="35%" x2="30%" y2="45%" strokeOpacity={0} strokeDasharray="4" />

                <line id="line-hardly-root" x1="50%" y1="50%" x2="60%" y2="65%" strokeOpacity={0} />
                <line id="line-grammar-hardly" x1="60%" y1="65%" x2="70%" y2="70%" strokeOpacity={0} />
                <line id="line-nuance-hardly" x1="60%" y1="65%" x2="55%" y2="80%" strokeOpacity={0} />
                <line id="line-mem-hardly" x1="60%" y1="65%" x2="65%" y2="55%" strokeOpacity={0} strokeDasharray="4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegacyChatGraph;
