import { useEffect, useState } from 'react';
import api from '../api';

const StockListPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadStock = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        setMessage('Could not load stock list.');
      }
    };
    loadStock();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Live Stock List</h1>
          <p>Browse current stock levels, brands, and wholesale pricing.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <div className="orders-table">
        <div className="orders-row header">
          <div>Name</div>
          <div>Brand</div>
          <div>Price</div>
          <div>Stock</div>
        </div>
        {products.map((product) => (
          <div key={product._id} className="orders-row">
            <div>{product.name}</div>
            <div>{product.brand}</div>
            <div>Tk {product.price.toFixed(2)}</div>
            <div>{product.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockListPage;
