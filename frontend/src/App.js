import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage from './pages/OrdersPage';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import AdminPage from './pages/AdminPage';
import AdminContactPage from './pages/AdminContactPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ReviewsPage from './pages/ReviewsPage';
import api from './api';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mobileWholesaleUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [contactInfo, setContactInfo] = useState({
    email: 'support@mobilewholesale.com',
    phone: '+880-1234-567890',
    address: 'Dhaka, Bangladesh',
    whatsapp: '',
  });

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await api.get('/admin/site');
        setContactInfo(response.data.contact);
      } catch (error) {
        console.error('Could not load contact info', error);
      }
    };
    loadContact();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mobileWholesaleToken');
    localStorage.removeItem('mobileWholesaleUser');
    setUser(null);
  };

  const waNumber = contactInfo.whatsapp?.replace(/\D/g, '');
  const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div className="app-shell">
      <NavBar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={(userData) => { setUser(userData); }} />} />
        <Route path="/register" element={<RegisterPage onRegister={(userData) => { setUser(userData); }} />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} onLogout={handleLogout} onProfileUpdate={(updatedUser) => { localStorage.setItem('mobileWholesaleUser', JSON.stringify(updatedUser)); setUser(updatedUser); }} /> : <Navigate to="/login" />} />
        <Route path="/products" element={<ProductPage user={user} />} />
        <Route path="/products/:id" element={<ProductDetailPage user={user} />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/orders" element={user ? <OrdersPage user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/admin/contact" element={user?.role === 'admin' ? <AdminContactPage /> : <Navigate to="/login" />} />
        <Route path="/admin/gallery" element={user?.role === 'admin' ? <AdminGalleryPage /> : <Navigate to="/login" />} />
        <Route path="/contact" element={<ContactPage contactInfo={contactInfo} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* WhatsApp Floating Button */}
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M20.52 3.48A11.93 11.93 0 0012.01 0C5.37 0 0 5.37 0 12a11.94 11.94 0 001.64 6.07L0 24l6.12-1.6A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12a11.93 11.93 0 00-3.48-8.52zm-8.51 18.4a9.92 9.92 0 01-5.06-1.38l-.36-.21-3.74.98.99-3.64-.23-.37A9.93 9.93 0 0112 2.08c5.47 0 9.92 4.45 9.92 9.92s-4.45 9.88-9.91 9.88zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.16 8.16 0 01-2.4-1.48 9.07 9.07 0 01-1.66-2.07c-.17-.3 0-.46.13-.61s.3-.35.45-.52a2 2 0 00.3-.5.55.55 0 000-.52c-.07-.15-.67-1.62-.92-2.21s-.49-.5-.67-.51h-.57a1.1 1.1 0 00-.8.38 3.36 3.36 0 00-1.04 2.5 5.83 5.83 0 001.22 3.1c.15.2 2.1 3.2 5.08 4.49a17.2 17.2 0 001.7.63 4.08 4.08 0 001.87.12c.57-.08 1.77-.72 2.02-1.42s.25-1.3.17-1.42-.27-.22-.57-.37z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      )}
    </div>
  );
}

export default App;
