import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <>
      <div className="page-container home-page" style={{ paddingBottom: '40px', minHeight: 'auto' }}>
        <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">Bangladesh's leading mobile wholesale supplier</span>
          <h1>Wholesale mobile phones, tablets and accessories</h1>
          <p>
            Browse bulk-ready inventory, competitive wholesale pricing, fast dispatch and
            dedicated account support for our buyers.
          </p>
          <div className="home-hero-actions">
            <Link className="button" to="/products">Browse Products</Link>
            <a className="button button-secondary" href="#footer">Contact Us ↓</a>
          </div>
          <div className="home-stats-row">
            <div className="home-stat-item">
              <strong>12,000+</strong>
              <span>SKUs in stock</span>
            </div>
            <div className="home-stat-item">
              <strong>15 yrs</strong>
              <span>In business</span>
            </div>
            <div className="home-stat-item">
              <strong>Same day</strong>
              <span>Dispatch available</span>
            </div>
          </div>
        </div>
        <div className="home-hero-graphic">
          <div className="hero-graphic-card">
            <div className="hero-tag">Mobile Wholesale</div>
            <div className="hero-product-line">Latest trade-ready phones and accessories</div>
            <div className="hero-preview-grid">
              <div className="hero-preview-card">Samsung</div>
              <div className="hero-preview-card">Apple</div>
              <div className="hero-preview-card">Xiaomi</div>
              <div className="hero-preview-card">OnePlus</div>
            </div>
          </div>
        </div>
      </section>

      </div>

      <section className="home-video-section" style={{ width: '100%', backgroundColor: '#0f1117' }}>
        <video 
          style={{ width: '100%', height: 'calc(100vh - 70px)', objectFit: 'cover', display: 'block' }}
          autoPlay 
          loop 
          muted 
          playsInline
        >
          {/* Looping background video */}
          <source src="/3773898.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
    </>
  );
};

export default HomePage;
