import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

const Footer = () => {
  const [contact, setContact] = useState({
    email: 'support@mobilewholesale.com',
    phone: '+880-1234-567890',
    address: 'Dhaka, Bangladesh',
    whatsapp: '',
  });

  useEffect(() => {
    api.get('/admin/site')
      .then((res) => setContact(res.data.contact))
      .catch(() => {});
  }, []);

  const waNumber = contact.whatsapp?.replace(/\D/g, '');
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="site-footer">
      {/* Top glow line */}
      <div className="footer-glow-line" />

      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo-text">
            📱 Mobile <span>Wholesale</span>
          </div>
          <p className="footer-tagline">
            Bangladesh's leading wholesale supplier of smartphones, tablets and mobile accessories.
            Serving bulk buyers with competitive pricing since 2009.
          </p>
          <div className="footer-socials">
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="footer-social-btn wa">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M20.52 3.48A11.93 11.93 0 0012.01 0C5.37 0 0 5.37 0 12a11.94 11.94 0 001.64 6.07L0 24l6.12-1.6A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12a11.93 11.93 0 00-3.48-8.52zm-8.51 18.4a9.92 9.92 0 01-5.06-1.38l-.36-.21-3.74.98.99-3.64-.23-.37A9.93 9.93 0 0112 2.08c5.47 0 9.92 4.45 9.92 9.92s-4.45 9.88-9.91 9.88zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.16 8.16 0 01-2.4-1.48 9.07 9.07 0 01-1.66-2.07c-.17-.3 0-.46.13-.61s.3-.35.45-.52a2 2 0 00.3-.5.55.55 0 000-.52c-.07-.15-.67-1.62-.92-2.21s-.49-.5-.67-.51h-.57a1.1 1.1 0 00-.8.38 3.36 3.36 0 00-1.04 2.5 5.83 5.83 0 001.22 3.1c.15.2 2.1 3.2 5.08 4.49a17.2 17.2 0 001.7.63 4.08 4.08 0 001.87.12c.57-.08 1.77-.72 2.02-1.42s.25-1.3.17-1.42-.27-.22-.57-.37z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/blog">Blog &amp; News</Link>
            <Link to="/about">About Us</Link>
            <Link to="/reviews">Customer Reviews</Link>
          </nav>
        </div>

        {/* Account */}
        <div className="footer-col">
          <h4 className="footer-col-title">Account</h4>
          <nav className="footer-nav">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/orders">My Orders</Link>
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact Us</h4>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📍</span>
              <span>{contact.address}</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📞</span>
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">✉️</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
            {waLink && (
              <div className="footer-contact-item">
                <span className="footer-contact-icon">💬</span>
                <a href={waLink} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {year} Mobile Wholesale BD. All rights reserved.</p>
        <p className="footer-made">Made with ❤️ for wholesale buyers across Bangladesh.</p>
      </div>
    </footer>
  );
};

export default Footer;
