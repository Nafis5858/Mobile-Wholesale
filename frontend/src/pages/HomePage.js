import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <div className="page-container home-page">
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
            <Link className="button button-secondary" to="/contact">Contact Sales</Link>
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

      <section className="home-cards-grid">
        <div className="home-card">
          <div className="home-card-icon">📱</div>
          <h3>Product Display</h3>
          <p>Browse 10,000+ mobile phones by brand, grade, storage and price.</p>
          <Link className="home-card-button" to="/products">View All Products</Link>
        </div>

        <div className="home-card">
          <div className="home-card-icon">🖼️</div>
          <h3>Image Gallery</h3>
          <p>See product photos, warehouse views and detailed mobile condition images.</p>
          <Link className="home-card-button" to="/gallery">View Gallery</Link>
        </div>
        <div className="home-card">
          <div className="home-card-icon">📰</div>
          <h3>Blog & News</h3>
          <p>Read industry updates, market insights and mobile wholesale trends.</p>
          <Link className="home-card-button" to="/blog">Read Blog</Link>
        </div>
        <div className="home-card">
          <div className="home-card-icon">⭐</div>
          <h3>Reviews</h3>
          <p>See verified reviews from trade partners and wholesale customers.</p>
          <Link className="home-card-button" to="/reviews">Read Reviews</Link>
        </div>
        <div className="home-card">
          <div className="home-card-icon">☎️</div>
          <h3>Contact Us</h3>
          <p>Reach our sales team by phone, email, or online enquiry form.</p>
          <Link className="home-card-button" to="/contact">Get In Touch</Link>
        </div>
        <div className="home-card">
          <div className="home-card-icon">🎥</div>
          <h3>Company Video</h3>
          <p>Watch our company overview video to learn more about our trade services.</p>
          <Link className="home-card-button" to="/about">Watch Video</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
