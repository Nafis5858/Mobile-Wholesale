import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
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
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default App;
