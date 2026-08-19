import { useEffect, useState } from 'react';
import api, { getAssetUrl } from '../api';

const ProductPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [message, setMessage] = useState('');
  const [productMsg, setProductMsg] = useState('');
  const [form, setForm] = useState({ name: '', brand: '', description: '', price: '', stock: '', minQuantity: 1, imageFile: null });
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

  const handleProductChange = (event) => {
    const { name, value, files, type } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setProductMsg('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('description', form.description);
      formData.append('price', Number(form.price));
      formData.append('stock', Number(form.stock));
      formData.append('minQuantity', Number(form.minQuantity || 1));
      if (form.imageFile) formData.append('imageFile', form.imageFile);

      const response = await api.post('/products', formData);
      setProducts((prev) => [response.data, ...prev]);
      setForm({ name: '', brand: '', description: '', price: '', stock: '', minQuantity: 1, imageFile: null });
      event.target.reset();
      setProductMsg('✅ Product created successfully.');
    } catch (error) {
      setProductMsg(error.response?.data?.message || 'Could not create product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    setProductMsg('');
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setProductMsg('Product deleted.');
    } catch (error) {
      setProductMsg(error.response?.data?.message || 'Could not delete product.');
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

      {isAdmin && (
        <section className="hero-card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Product</h2>
          {productMsg && <p className="status-message">{productMsg}</p>}
          <form className="auth-card" onSubmit={handleCreate}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleProductChange} required />
            <label>Brand</label>
            <input name="brand" value={form.brand} onChange={handleProductChange} required />
            <label>Description</label>
            <input name="description" value={form.description} onChange={handleProductChange} />
            <label>Price</label>
            <input name="price" type="number" value={form.price} onChange={handleProductChange} required />
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleProductChange} required />
            <label>Min Order Quantity (MOQ)</label>
            <input name="minQuantity" type="number" value={form.minQuantity} onChange={handleProductChange} min="1" required />
            <label>Product Image</label>
            <input name="imageFile" type="file" accept="image/*" onChange={handleProductChange} />
            <button type="submit">Create Product</button>
          </form>
        </section>
      )}

      {message && !isAdmin && <p className="status-message">{message}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={getAssetUrl(product.imageUrl) || 'https://via.placeholder.com/260x180?text=Mobile'} alt={product.name} />
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
              {isAdmin && (
                <button onClick={() => handleDeleteProduct(product._id)} className="logout-button" style={{ width: '100%', marginTop: '10px' }}>
                  Delete Product
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
