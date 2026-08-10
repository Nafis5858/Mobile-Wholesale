import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const DashboardPage = ({ user, onLogout, onProfileUpdate }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersMessage, setOrdersMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    address: user.address || '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') return;

    const loadOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setRecentOrders(response.data.slice(0, 4));
      } catch (error) {
        setOrdersMessage('Unable to load recent orders.');
      }
    };

    loadOrders();
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');

    try {
      const response = await api.put('/auth/profile', {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        address: profile.address,
      });
      onProfileUpdate(response.data);
      setProfileMessage('Profile updated successfully.');
      setEditMode(false);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Unable to update profile.');
    }
  };

  return (
    <div className="page-container dashboard-page">
      <header className="page-header dashboard-header">
        <div className="dashboard-welcome">
          <h1>Welcome, {user.name}</h1>
          <p>{user.role === 'admin' ? 'Admin control panel' : 'Buyer dashboard'}</p>
          <p className="dashboard-note">Use the top navigation to browse products, manage stock, or sign out.</p>
        </div>
      </header>
      <section className="hero-card dashboard-hero-card">
        <h2>{user.role === 'admin' ? 'Manage site content and products' : 'Buy wholesale smartphones with confidence'}</h2>
        <p>{user.role === 'admin' ? 'Create, edit, and remove products and site content.' : 'Use this portal to register, login, view products, and place purchase orders.'}</p>
      </section>
      {user.role !== 'admin' && (
        <section className="dashboard-grid">
          <div className="dashboard-profile-card">
            <div className="dashboard-section-header">
              <div>
                <h3>Your Profile</h3>
                <p>Manage your contact details and delivery info.</p>
              </div>
              <button className="button button-secondary" onClick={() => setEditMode((prev) => !prev)}>
                {editMode ? 'Cancel' : 'Edit Info'}
              </button>
            </div>
            {profileMessage && <p className="success-message">{profileMessage}</p>}
            {profileError && <p className="error-message">{profileError}</p>}
            {editMode ? (
              <form className="dashboard-profile-form" onSubmit={handleProfileSave}>
                <label>Name</label>
                <input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} required />
                <label>Email</label>
                <input type="email" value={profile.email} disabled />
                <label>Phone</label>
                <input type="text" value={profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} />
                <label>Location</label>
                <input type="text" value={profile.location} onChange={(e) => handleProfileChange('location', e.target.value)} />
                <label>Address</label>
                <input type="text" value={profile.address} onChange={(e) => handleProfileChange('address', e.target.value)} />
                <button type="submit" className="button">Save Changes</button>
              </form>
            ) : (
              <div className="dashboard-profile-details">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
                <p><strong>Location:</strong> {profile.location || 'Not set'}</p>
                <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
              </div>
            )}
          </div>
          <div className="dashboard-orders-card">
            <div className="dashboard-section-header">
              <div>
                <h3>Recent Orders</h3>
                <p>Track your last wholesale purchases right from your dashboard.</p>
              </div>
              <Link className="button button-secondary" to="/orders">View All Orders</Link>
            </div>
            {ordersMessage && <p className="status-message">{ordersMessage}</p>}
            {recentOrders.length > 0 ? (
              <div className="orders-table dashboard-orders-table">
                <div className="orders-row header">
                  <div>Product</div>
                  <div>Qty</div>
                  <div>Total</div>
                  <div>Status</div>
                </div>
                {recentOrders.map((order) => (
                  <div key={order._id} className="orders-row">
                    <div>{order.product?.name || 'Unknown'}</div>
                    <div>{order.quantity}</div>
                    <div>Tk {order.totalPrice.toFixed(2)}</div>
                    <div>{order.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                No recent orders yet. Browse products to place your first wholesale order.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
