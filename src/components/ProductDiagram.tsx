import type { ProductKey } from '@/lib/product-paths';

type ProductDiagramProps = {
  variant: ProductKey;
  compact?: boolean;
};

export function ProductDiagram({ variant, compact = false }: ProductDiagramProps) {
  return (
    <div className={`product-diagram ${variant} ${compact ? 'compact' : ''}`} aria-hidden="true">
      {variant === 'local' ? <LocalDiagram /> : null}
      {variant === 'cloud' ? <CloudDiagram /> : null}
      {variant === 'edge' ? <EdgeDiagram /> : null}
    </div>
  );
}

function LocalDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 320 220" role="img">
      <defs>
        <linearGradient id="localRack" x1="47" y1="48" x2="129" y2="166" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34364d" />
          <stop offset="1" stopColor="#242633" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#34364d" floodOpacity="0.14" />
        </filter>
      </defs>

      <path className="diagram-route" d="M117 81 H151 C164 81 164 104 177 104 H196" />
      <path className="diagram-route" d="M117 139 H151 C164 139 164 116 177 116 H196" />
      <path className="diagram-route" d="M238 110 H263" />
      <path className="diagram-route muted" d="M238 147 H263" />

      <g filter="url(#softShadow)">
        <rect x="42" y="50" width="88" height="120" rx="18" fill="#fffdf7" />
        <rect x="55" y="66" width="62" height="22" rx="7" fill="url(#localRack)" />
        <rect x="55" y="99" width="62" height="22" rx="7" fill="url(#localRack)" />
        <rect x="55" y="132" width="62" height="22" rx="7" fill="url(#localRack)" />
        <circle cx="68" cy="77" r="3.5" fill="#efc985" />
        <circle cx="68" cy="110" r="3.5" fill="#82ad92" />
        <circle cx="68" cy="143" r="3.5" fill="#df7458" />
        <path d="M83 77 H106 M83 110 H106 M83 143 H106" stroke="#fffdf7" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      </g>

      <g filter="url(#softShadow)">
        <rect x="188" y="72" width="62" height="76" rx="16" fill="#292a37" />
        <rect x="201" y="86" width="36" height="28" rx="8" fill="#efc985" />
        <path d="M202 129 H235" stroke="#fffdf7" strokeWidth="4" strokeLinecap="round" opacity="0.88" />
        <path d="M202 138 H225" stroke="#fffdf7" strokeWidth="4" strokeLinecap="round" opacity="0.54" />
        <path d="M219 58 V72 M219 148 V162 M174 110 H188 M250 110 H264" stroke="#292a37" strokeWidth="3" strokeLinecap="round" />
      </g>

      <g filter="url(#softShadow)">
        <rect x="266" y="82" width="28" height="56" rx="9" fill="#fffdf7" stroke="#292a37" strokeWidth="3" />
        <path d="M274 98 H286 M274 111 H286 M274 124 H282" stroke="#82ad92" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="280" cy="154" rx="27" ry="9" fill="#fffdf7" stroke="#292a37" strokeWidth="3" />
        <path d="M253 154 V177 C253 184 265 190 280 190 C295 190 307 184 307 177 V154" fill="#fffdf7" stroke="#292a37" strokeWidth="3" />
        <ellipse cx="280" cy="177" rx="27" ry="9" fill="#f0eadf" stroke="#292a37" strokeWidth="3" />
      </g>

      <g className="diagram-local-labels">
        <path d="M50 34 H122" />
        <path d="M186 34 H252" />
        <path d="M252 204 H307" />
      </g>
    </svg>
  );
}

function CloudDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 320 220" role="img">
      <defs>
        <radialGradient id="cloudGlow" cx="50%" cy="45%" r="58%">
          <stop stopColor="#efc985" stopOpacity="0.58" />
          <stop offset="1" stopColor="#efc985" stopOpacity="0" />
        </radialGradient>
        <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#34364d" floodOpacity="0.13" />
        </filter>
      </defs>

      <rect width="320" height="220" fill="url(#cloudGlow)" opacity="0.8" />
      <path className="diagram-route" d="M93 145 H136 C151 145 151 116 166 116 H194" />
      <path className="diagram-route" d="M93 145 H136 C151 145 151 171 166 171 H194" />
      <path className="diagram-route muted" d="M226 116 H260" />
      <path className="diagram-route muted" d="M226 171 H260" />

      <g filter="url(#cloudShadow)">
        <path d="M96 96 C96 76 112 61 133 64 C143 47 172 50 178 71 C196 72 210 86 210 104 C210 124 194 137 173 137 H111 C91 137 78 126 78 110 C78 102 84 97 96 96 Z" fill="#fffdf7" stroke="#292a37" strokeWidth="3" />
        <circle cx="144" cy="101" r="20" fill="#df7458" />
        <path d="M135 101 H153 M144 92 V110" stroke="#fffdf7" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g filter="url(#cloudShadow)">
        <rect x="42" y="126" width="64" height="39" rx="13" fill="#34364d" />
        <path d="M59 141 H87 M59 151 H81" stroke="#fffdf7" strokeWidth="4" strokeLinecap="round" opacity="0.88" />
        <circle cx="92" cy="140" r="4.5" fill="#efc985" />
      </g>

      <g filter="url(#cloudShadow)">
        <rect x="194" y="94" width="54" height="43" rx="14" fill="#292a37" />
        <path d="M209 110 H232 M209 121 H226" stroke="#fffdf7" strokeWidth="4" strokeLinecap="round" opacity="0.84" />
        <circle cx="235" cy="108" r="4.5" fill="#82ad92" />
      </g>

      <g filter="url(#cloudShadow)">
        <rect x="194" y="149" width="54" height="43" rx="14" fill="#fffdf7" stroke="#292a37" strokeWidth="3" />
        <path d="M209 165 H232 M209 176 H226" stroke="#292a37" strokeWidth="4" strokeLinecap="round" opacity="0.76" />
        <circle cx="235" cy="163" r="4.5" fill="#efc985" />
      </g>

      <g className="diagram-pulse">
        <circle cx="144" cy="101" r="37" />
      </g>

      <g className="diagram-cloud-lines">
        <path d="M262 109 H297" />
        <path d="M262 124 H288" />
        <path d="M262 166 H297" />
        <path d="M262 181 H286" />
      </g>
    </svg>
  );
}

function EdgeDiagram() {
  return (
    <svg className="diagram-svg" viewBox="0 0 320 220" role="img">
      <defs>
        <linearGradient id="edgeScreen" x1="116" y1="31" x2="202" y2="193" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffdf7" />
          <stop offset="1" stopColor="#f0eadf" />
        </linearGradient>
        <filter id="edgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#34364d" floodOpacity="0.15" />
        </filter>
      </defs>

      <g className="edge-rings">
        <ellipse cx="160" cy="111" rx="96" ry="42" />
        <ellipse cx="160" cy="111" rx="96" ry="42" transform="rotate(64 160 111)" />
        <ellipse cx="160" cy="111" rx="96" ry="42" transform="rotate(-64 160 111)" />
      </g>

      <g filter="url(#edgeShadow)">
        <rect x="108" y="24" width="104" height="172" rx="27" fill="#292a37" />
        <rect x="117" y="40" width="86" height="140" rx="19" fill="url(#edgeScreen)" />
        <rect x="142" y="34" width="36" height="5" rx="3" fill="#f8f4ea" opacity="0.9" />
      </g>

      <g filter="url(#edgeShadow)">
        <rect x="135" y="63" width="50" height="50" rx="13" fill="#292a37" />
        <rect x="146" y="74" width="28" height="28" rx="7" fill="#efc985" />
        <path d="M160 54 V63 M160 113 V124 M126 88 H135 M185 88 H194 M131 70 L139 77 M189 70 L181 77 M131 106 L139 99 M189 106 L181 99" stroke="#292a37" strokeWidth="3" strokeLinecap="round" />
      </g>

      <path className="edge-waveform" d="M132 148 V133 M144 148 V124 M156 148 V137 M168 148 V119 M180 148 V130 M192 148 V140" />
      <path className="diagram-route muted" d="M92 111 C69 111 58 100 58 84 C58 67 73 57 92 59" />
      <path className="diagram-route muted" d="M228 111 C251 111 262 100 262 84 C262 67 247 57 228 59" />
      <circle cx="58" cy="84" r="7" fill="#82ad92" />
      <circle cx="262" cy="84" r="7" fill="#df7458" />
    </svg>
  );
}
