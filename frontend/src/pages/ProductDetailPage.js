import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getAssetUrl } from '../api';
import { CartContext } from '../contexts/CartContext';

const ProductDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setQuantity(response.data.minQuantity || 1);
      } catch (error) {
        setMessage('Could not load product details.');
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (isAdmin) {
      setMessage('Admin users cannot add products to the cart.');
      return;
    }
    if (!product) return;

    const moq = product.minQuantity || 1;
    const qty = Math.max(moq, Math.min(product.stock, Number(quantity)));
    addToCart(product, qty);
    setMessage('Product added to cart!');
  };

  const handleBuyNow = () => {
    if (isAdmin) {
      setMessage('Admin users cannot purchase products.');
      return;
    }
    if (!product) return;

    const moq = product.minQuantity || 1;
    const qty = Math.max(moq, Math.min(product.stock, Number(quantity)));
    addToCart(product, qty);
    navigate('/checkout');
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
            <img src={getAssetUrl(product.imageUrl) || 'https://via.placeholder.com/540x360?text=Mobile'} alt={product.name} />
          </div>
          <div className="detail-info">
            <div className="detail-header">
              <h2>{product.name}</h2>
              <span className="detail-brand">{product.brand}</span>
            </div>
            <p className="detail-description">{product.description || 'No description provided yet.'}</p>
            <div className="detail-pricing">
              <span className="product-price">Tk {product.price.toFixed(2)}</span>
              <span className="product-stock">Stock: {product.stock} | MOQ: {product.minQuantity || 1}</span>
            </div>
            {user?.role !== 'admin' ? (
              <>
                <div className="detail-actions">
                  <div className="quantity-row">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min={product.minQuantity || 1}
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <button className="button" onClick={handleAddToCart} disabled={product.stock < (product.minQuantity || 1)}>
                    Add to Cart
                  </button>
                  <button className="button button-secondary" onClick={handleBuyNow} disabled={product.stock < (product.minQuantity || 1)}>
                    Buy Now
                  </button>
                </div>
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
