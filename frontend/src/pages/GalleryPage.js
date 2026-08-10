import { useEffect, useState } from 'react';
import api from '../api';

const GalleryPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        setMessage('Could not load gallery images.');
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Image Gallery</h1>
          <p>View product photos and gallery images for our wholesale mobile inventory.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <div className="gallery-grid">
        {products.map((product) => (
          <div key={product._id} className="gallery-card">
            <img src={product.imageUrl || 'https://via.placeholder.com/360x260?text=Mobile'} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
