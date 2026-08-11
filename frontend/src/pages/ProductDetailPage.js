import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ProductDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setMessage('Could not load product details.');
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      setMessage('Please login first to add products to cart.');
      return;
    }
    if (isAdmin) {
      setMessage('Admin users cannot add products to the cart.');
      return;
    }
    if (!product) return;

    const qty = Math.max(1, Math.min(product.stock, Number(quantity)));
    const cart = JSON.parse(localStorage.getItem('mobileWholesaleCart') || '[]');
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      existing.quantity = Math.min(product.stock, existing.quantity + qty);
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: qty,
      });
    }
    localStorage.setItem('mobileWholesaleCart', JSON.stringify(cart));
    setMessage('Product added to cart.');
  };

  const handleBuyNow = async () => {
    if (!user) {
      setMessage('Please login first to buy now.');
      return;
    }
    if (isAdmin) {
      setMessage('Admin users cannot purchase products.');
      return;
    }
    if (!product) return;

    const qty = Math.max(1, Math.min(product.stock, Number(quantity)));
    try {
      await api.post('/orders', { productId: product._id, quantity: qty });
      setMessage('Order placed successfully. Redirecting to orders...');
      setTimeout(() => navigate('/orders'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not complete purchase.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Product Details</h1>
          <p>Explore the product, then add to cart or buy now.</p>
        </div>
      </header>

      {message && <p className="status-message">{message}</p>}

      {product ? (
        <div className="product-detail-card">
          <div className="detail-media">
            <img src={product.imageUrl || 'https://via.placeholder.com/540x360?text=Mobile'} alt={product.name} />
          </div>
          <div className="detail-info">
            <div className="detail-header">
              <h2>{product.name}</h2>
              <span className="detail-brand">{product.brand}</span>
            </div>
            <p className="detail-description">{product.description || 'No description provided yet.'}</p>
            <div className="detail-pricing">
              <span className="product-price">Tk {product.price.toFixed(2)}</span>
              <span className="product-stock">Stock: {product.stock}</span>
            </div>
            {user?.role !== 'admin' ? (
              <>
                <div className="detail-actions">
                  <div className="quantity-row">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <button className="button" onClick={handleAddToCart} disabled={product.stock < 1}>
                    Add to Cart
                  </button>
                  <button className="button button-secondary" onClick={handleBuyNow} disabled={product.stock < 1}>
                    Buy Now
                  </button>
                </div>
                {!user && (
                  <div className="detail-login-note">
                    <p>Please <Link to="/login">login</Link> first to order or add to cart.</p>
                  </div>
                )}
              </>
            ) : (
              <p className="status-message">Admin users cannot order or view product purchase details.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
