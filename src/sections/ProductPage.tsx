import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductDiagram } from '@/components/ProductDiagram';
import { getProductPath, productPaths, type ProductKey } from '@/lib/product-paths';

type ProductPageProps = {
  productKey: ProductKey;
  onOpenNotify: (source?: string) => void;
};

export function ProductPage({ productKey, onOpenNotify }: ProductPageProps) {
  const product = getProductPath(productKey) ?? productPaths[1];
  const comparePath = product.key === 'cloud' ? '/local' : '/#platform';
  const notifySource = `${product.key}-${product.status.toLowerCase()}`;

  return (
    <main className={`site-main product-page product-${product.key}`}>
      <section className="product-hero">
        <div className="site-shell product-hero-grid">
          <div className="product-copy">
            <a className="back-link" href="/#platform">
              <ArrowLeft size={16} />
              All paths
            </a>
            <span className="product-eyebrow">{product.eyebrow}</span>
            <h1>
              {product.heroTitle}
              <span>{product.heroAccent}</span>
            </h1>
            <p>{product.heroText}</p>
            <div className="hero-actions">
              <button className="button primary" type="button" onClick={() => onOpenNotify(notifySource)}>
                {product.primaryCta} <ArrowRight size={17} />
              </button>
              <a className="button secondary" href={comparePath}>
                {product.secondaryCta}
              </a>
            </div>
          </div>

          <div className="product-hero-visual">
            <ProductDiagram variant={product.key} />
          </div>
        </div>
      </section>

      <section className="product-detail-section">
        <div className="site-shell product-detail-grid">
          {product.details.map((detail) => (
            <article className="product-detail-card" key={detail.title}>
              <h2>{detail.title}</h2>
              <p>{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="access-section">
        <div className="site-shell access-card">
          <h2>{product.key === 'cloud' ? 'Use the hosted beta.' : `Explore ${product.title}.`}</h2>
          <button className="button primary" type="button" onClick={() => onOpenNotify(notifySource)}>
            {product.primaryCta} <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}
