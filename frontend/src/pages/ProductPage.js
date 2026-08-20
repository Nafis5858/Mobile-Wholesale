import { useEffect, useState } from 'react';
import api, { getAssetUrl, handleImageError } from '../api';

const ProductPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [message, setMessage] = useState('');
  const [productMsg, setProductMsg] = useState('');
  const [form, setForm] = useState({ name: '', brand: '', description: '', price: '', stock: '', minQuantity: 1, imageFile: null });
  const isAdmin = user?.role === 'admin';

  // Edit state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', brand: '', description: '', price: '', stock: '', minQuantity: 1, imageFile: null });
  const [editMsg, setEditMsg] = useState('');
  const [editLoading, setEditLoading] = useState(false);

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

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      minQuantity: product.minQuantity || 1,
      imageFile: null,
    });
    setEditMsg('');
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
    setEditMsg('');
  };

  const handleEditChange = (event) => {
    const { name, value, files, type } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;
    setEditMsg('');
    setEditLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('brand', editForm.brand);
      formData.append('description', editForm.description);
      formData.append('price', Number(editForm.price));
      formData.append('stock', Number(editForm.stock));
      formData.append('minQuantity', Number(editForm.minQuantity || 1));
      if (editForm.imageFile) formData.append('imageFile', editForm.imageFile);

      const response = await api.put(`/products/${editingProduct._id}`, formData);
      setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? response.data : p)));
      setProductMsg('✅ Product updated successfully.');
      handleCloseEdit();
    } catch (error) {
      setEditMsg(error.response?.data?.message || 'Could not update product.');
    } finally {
      setEditLoading(false);
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
            <img
              src={getAssetUrl(product.imageUrl)}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
            />
            <h3>{product.name}</h3>
            <p>{product.brand}</p>
            <p>{product.description}</p>
            <p className="product-price">Tk {product.price.toFixed(2)}</p>
            <p className="product-stock">Stock: {product.stock}</p>
            <div className="product-card-actions" style={isAdmin ? { display: 'flex', gap: '8px' } : undefined}>
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
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="button button-edit"
                  style={{ flex: 1 }}
                >
                  ✏️ Edit
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="logout-button"
                  style={{ flex: 1 }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={handleCloseEdit}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Product</h2>
              <button className="modal-close-btn" onClick={handleCloseEdit}>✕</button>
            </div>
            {editMsg && <p className="status-message">{editMsg}</p>}
            <form className="auth-card" onSubmit={handleSaveEdit} style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent' }}>
              <label>Name</label>
              <input name="name" value={editForm.name} onChange={handleEditChange} required />
              <label>Brand</label>
              <input name="brand" value={editForm.brand} onChange={handleEditChange} required />
              <label>Description</label>
              <input name="description" value={editForm.description} onChange={handleEditChange} />
              <label>Price (Tk)</label>
              <input name="price" type="number" value={editForm.price} onChange={handleEditChange} required />
              <label>Stock</label>
              <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} required />
              <label>Min Order Quantity (MOQ)</label>
              <input name="minQuantity" type="number" value={editForm.minQuantity} onChange={handleEditChange} min="1" required />
              <label>Replace Product Image (optional)</label>
              <input name="imageFile" type="file" accept="image/*" onChange={handleEditChange} />
              <div className="modal-actions">
                <button type="button" className="button button-secondary" onClick={handleCloseEdit}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
