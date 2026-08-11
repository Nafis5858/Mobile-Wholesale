import { useEffect, useState } from 'react';
import api from '../api';

const ProductPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [message, setMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        setMessage('Could not load products.');
      }
    };
    loadProducts();
  }, []);

  const handleOrder = async (productId) => {
    if (!user) {
      setMessage('Please login to place an order.');
      return;
    }
    if (isAdmin) {
      setMessage('Admin users cannot place orders.');
      return;
    }

    const qty = parseInt(quantity[productId] || '1', 10);
    setMessage('');
    try {
      await api.post('/orders', { productId, quantity: qty });
      setMessage('Order placed successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not place order.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Products</h1>
          <p>Browse the wholesale product catalog.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.imageUrl || 'https://via.placeholder.com/260x180?text=Mobile'} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.brand}</p>
            <p>{product.description}</p>
            <p className="product-price">Tk {product.price.toFixed(2)}</p>
            <p className="product-stock">Stock: {product.stock}</p>
            <div className="product-card-actions">
              {!isAdmin && (
                <button className="button button-card" onClick={() => window.open(`/products/${product._id}`, '_self')}>
                  View Details
                </button>
              )}
              {!isAdmin && (
                <button className="button button-secondary button-card" onClick={() => handleOrder(product._id)} disabled={product.stock < 1}>
                  Quick Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
