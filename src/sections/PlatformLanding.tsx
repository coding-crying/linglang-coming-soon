import { ArrowRight, FileText } from 'lucide-react';
import { HeroLiveDemo } from '@/components/HeroLiveDemo';
import { LegacyChatGraph } from '@/components/LegacyChatGraph';
import { ProductDiagram } from '@/components/ProductDiagram';
import { productPaths } from '@/lib/product-paths';

type PlatformLandingProps = {
  onOpenNotify: (source?: string) => void;
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function PlatformLanding({ onOpenNotify }: PlatformLandingProps) {
  return (
    <main className="site-main">
      <section id="hero" className="hero-section">
        <div className="site-shell hero-grid">
          <div className="hero-copy">
            <h1>
              <span className="ink-line">Don’t</span>
              <span className="ink-line">study.</span>
            </h1>
          </div>

          <div className="hero-demo-column">
            <HeroLiveDemo />
            <div className="hero-actions">
              <button
                className="button primary"
                type="button"
                onClick={() => onOpenNotify('hero-cloud-beta')}
              >
                Notify me at beta <ArrowRight size={17} />
              </button>
              <button className="button secondary" type="button" onClick={() => scrollTo('demo')}>
                See the memory
              </button>
            </div>
          </div>

          <div className="hero-speak">
            <p className="speak-line">Just speak.</p>
          </div>

          <p className="hero-slogan">Learn languages the natural way.</p>
        </div>
      </section>

      <section id="demo" className="demo-section">
        <div className="site-shell">
          <div className="section-intro centered">
            <h2>It notices the words that matter.</h2>
          </div>
          <LegacyChatGraph />
        </div>
      </section>

      <section id="platform" className="path-section">
        <div className="site-shell">
          <div className="section-intro">
            <h2>Three ways to run it.</h2>
            <p>
              The demo runs on Cloud. Local is the self-hosted framework. Edge is the on-device phone app.
            </p>
          </div>

          <div className="path-grid">
            {productPaths.map((path) => (
              <a
                key={path.key}
                className={`path-card ${path.featured ? 'featured' : ''}`}
                href={path.href}
              >
                <ProductDiagram variant={path.key} compact />
                <span className="path-status">{path.status}</span>
                <span className="path-eyebrow">{path.eyebrow}</span>
                <h3>{path.title}</h3>
                <p>{path.line}</p>
                <ul className="path-points">
                  {path.tilePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className="path-link">
                  Learn more <ArrowRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="research-band">
        <div className="site-shell research-inner">
          <div>
            <h2>Conversation first. Memory underneath.</h2>
          </div>
          <a className="button secondary" href="/research/linglang-thesis.pdf">
            Read the research <FileText size={17} />
          </a>
        </div>
      </section>

      <section id="access" className="access-section">
        <div className="site-shell access-card">
          <h2>Try LingLang Cloud Beta.</h2>
          <button className="button primary" type="button" onClick={() => onOpenNotify('access-cloud-beta')}>
            Notify me <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}
