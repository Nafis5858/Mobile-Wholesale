import { useEffect, useState } from 'react';
import api from '../api';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', brand: '', description: '', price: '', stock: '', imageFile: null });

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

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('brand', form.brand);
      formData.append('description', form.description);
      formData.append('price', Number(form.price));
      formData.append('stock', Number(form.stock));
      if (form.imageFile) {
        formData.append('imageFile', form.imageFile);
      }

      const response = await api.post('/products', formData);
      setProducts((prev) => [response.data, ...prev]);
      setForm({ name: '', brand: '', description: '', price: '', stock: '', imageFile: null });
      setMessage('Product created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create product.');
    }
  };

  const handleDelete = async (productId) => {
    setMessage('');
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      setMessage('Product deleted.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete product.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage products, gallery images, and static site content.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <section className="hero-card">
        <h2>Add New Product</h2>
        <form className="auth-card" onSubmit={handleCreate}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} required />
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} />
          <label>Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
          <label>Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
          <label>Product Image</label>
          <input name="imageFile" type="file" accept="image/*" onChange={handleChange} />
          <button type="submit">Create Product</button>
        </form>
      </section>
      <section>
        <h2>Existing Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.imageUrl || 'https://via.placeholder.com/260x180?text=Mobile'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
              <p>{product.description}</p>
              <p className="product-price">Tk {product.price.toFixed(2)}</p>
              <button onClick={() => handleDelete(product._id)} className="logout-button">Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
