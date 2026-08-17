import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import api, { getAssetUrl } from '../api';

const CheckoutPage = ({ user }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setShipping({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  if (user?.role === 'admin') {
    return (
      <div className="page-container">
        <div className="dashboard-empty-state" style={{ marginTop: '40px' }}>
          <h3>Access Denied</h3>
          <p>Admin users cannot purchase products or access the cart checkout page.</p>
          <Link to="/admin" className="button" style={{ marginTop: '16px' }}>Go to Admin Panel</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const itemsPayload = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      await api.post('/orders/checkout', {
        items: itemsPayload,
        phone: shipping.phone,
        address: shipping.address,
      });

      setSuccessMsg('Order placed successfully!');
      clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Checkout</h1>
          <p>Review your cart and confirm your shipping details.</p>
        </div>
      </header>

      {errorMsg && <p className="status-message error-message">{errorMsg}</p>}
      {successMsg && <p className="status-message success-message">{successMsg}</p>}

      {cartItems.length === 0 ? (
        <div className="dashboard-empty-state" style={{ marginTop: '40px' }}>
          <h3>Your cart is empty.</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="button" style={{ marginTop: '16px' }}>Browse Products</Link>
        </div>
      ) : (
        <div className="product-detail-card" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start' }}>
          
          {/* Cart Items */}
          <div className="cart-items-section">
            <h3 style={{ marginBottom: '20px' }}>Your Cart ({cartCount} items)</h3>
            <div className="orders-table" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
              {cartItems.map((item) => (
                <div key={item.product?._id || Math.random()} className="orders-row" style={{ gridTemplateColumns: '80px 2fr 1fr auto auto', gap: '16px', background: 'var(--surface-2)' }}>
                  <img 
                    src={getAssetUrl(item.product?.imageUrl) || 'https://via.placeholder.com/80?text=Mobile'} 
                    alt={item.product?.name || 'Unknown Product'} 
                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} 
                  />
                  <div>
                    <h4 style={{ margin: '0 0 6px 0' }}>{item.product?.name || 'Unknown'}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)' }}>MOQ: {item.product?.minQuantity || 1}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-2)' }}>Tk {item.product?.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="quantity-row" style={{ gridTemplateColumns: '1fr' }}>
                    <input 
                      type="number" 
                      min={item.product?.minQuantity || 1}
                      max={item.product?.stock || 999}
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.product?._id, Number(e.target.value))}
                      style={{ padding: '8px' }}
                    />
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    Tk {((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                  <button onClick={() => removeFromCart(item.product?._id)} className="logout-button" style={{ padding: '8px', borderRadius: '8px' }}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-summary-section" style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <strong style={{ color: 'var(--primary-light)' }}>Tk {calculateTotal()}</strong>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-strong)', margin: '20px 0' }} />

            <h4 style={{ marginBottom: '16px' }}>Shipping Details</h4>
            
            {!user ? (
              <div className="detail-login-note">
                <p>You must <Link to="/login?redirect=/checkout">log in</Link> or <Link to="/register">register</Link> to checkout.</p>
              </div>
            ) : (
              <form className="dashboard-profile-form" onSubmit={handleCheckout}>
                <label>Contact Name</label>
                <input name="name" value={shipping.name} onChange={handleChange} required />
                
                <label>Phone Number</label>
                <input name="phone" value={shipping.phone} onChange={handleChange} required />
                
                <label>Delivery Address</label>
                <input name="address" value={shipping.address} onChange={handleChange} required />
                
                <button type="submit" className="button" style={{ width: '100%', marginTop: '16px', padding: '16px', fontSize: '1.05rem' }} disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
