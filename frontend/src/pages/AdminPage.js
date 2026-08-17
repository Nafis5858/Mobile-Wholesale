import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getAssetUrl } from '../api';

const AdminPage = () => {
  // ── Products ─────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productMsg, setProductMsg] = useState('');
  const [form, setForm] = useState({ name: '', brand: '', description: '', price: '', stock: '', minQuantity: 1, imageFile: null });

  // ── Gallery ──────────────────────────────────────────────
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryMsg, setGalleryMsg] = useState('');
  const [galleryForm, setGalleryForm] = useState({ title: '', imageFile: null });
  const [galleryUploading, setGalleryUploading] = useState(false);

  // ── Load data on mount ────────────────────────────────────
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch {
        setProductMsg('Could not load products.');
      }
    };

    const loadGallery = async () => {
      try {
        const response = await api.get('/admin/gallery');
        setGalleryImages(response.data);
      } catch {
        setGalleryMsg('Could not load gallery images.');
      }
    };

    loadProducts();
    loadGallery();
  }, []);

  // ── Product handlers ──────────────────────────────────────
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

  // ── Gallery handlers ──────────────────────────────────────
  const handleGalleryChange = (event) => {
    const { name, value, files, type } = event.target;
    setGalleryForm((prev) => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
  };

  const handleGalleryUpload = async (event) => {
    event.preventDefault();
    if (!galleryForm.imageFile) {
      setGalleryMsg('Please select an image file to upload.');
      return;
    }
    setGalleryUploading(true);
    setGalleryMsg('');
    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title);
      formData.append('imageFile', galleryForm.imageFile);

      const response = await api.post('/admin/gallery', formData);
      setGalleryImages((prev) => [response.data, ...prev]);
      setGalleryForm({ title: '', imageFile: null });
      event.target.reset();
      setGalleryMsg('✅ Photo uploaded to gallery successfully.');
    } catch (error) {
      setGalleryMsg(error.response?.data?.message || 'Could not upload gallery photo.');
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    setGalleryMsg('');
    try {
      await api.delete(`/admin/gallery/${id}`);
      setGalleryImages((prev) => prev.filter((img) => img._id !== id));
      setGalleryMsg('Gallery photo deleted.');
    } catch (error) {
      setGalleryMsg(error.response?.data?.message || 'Could not delete gallery photo.');
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage products, gallery images, and static site content.</p>
        </div>
      </header>


      {/* ── QUICK LINKS ── */}
      <section style={{ width: '100%', maxWidth: '1200px', display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <Link
          to="/admin/contact"
          className="button"
          style={{ background: '#0f172a', textDecoration: 'none', padding: '14px 24px', borderRadius: '14px', fontWeight: 700 }}
        >
          ✏️ Edit Contact Info &amp; WhatsApp
        </Link>
        <Link
          to="/admin/gallery"
          className="button"
          style={{ background: '#7c3aed', textDecoration: 'none', padding: '14px 24px', borderRadius: '14px', fontWeight: 700 }}
        >
          🖼️ Manage Gallery
        </Link>
      </section>

      {/* ── PRODUCTS SECTION ── */}
      <section className="hero-card">
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

      <section>
        <h2>Existing Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={getAssetUrl(product.imageUrl) || 'https://via.placeholder.com/260x180?text=Mobile'}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
              <p>{product.description}</p>
              <p className="product-price">Tk {product.price.toFixed(2)}</p>
              <p className="product-stock">Stock: {product.stock} | MOQ: {product.minQuantity || 1}</p>
              <button onClick={() => handleDeleteProduct(product._id)} className="logout-button">
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY SECTION ── */}
      <section className="hero-card" style={{ marginTop: '2rem' }}>
        <h2>📷 Upload Gallery Photo</h2>
        <p style={{ marginBottom: '1rem', opacity: 0.7 }}>
          Photos uploaded here will appear on the public Gallery page.
        </p>
        {galleryMsg && <p className="status-message">{galleryMsg}</p>}
        <form className="auth-card" onSubmit={handleGalleryUpload}>
          <label>Photo Title (optional)</label>
          <input
            name="title"
            value={galleryForm.title}
            onChange={handleGalleryChange}
            placeholder="e.g. iPhone 15 Pro Max"
          />
          <label>Select Photo</label>
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={handleGalleryChange}
            required
          />
          <button type="submit" disabled={galleryUploading}>
            {galleryUploading ? 'Uploading...' : 'Upload to Gallery'}
          </button>
        </form>
      </section>

      <section>
        <h2>Gallery Photos</h2>
        {galleryImages.length === 0 ? (
          <p className="status-message">No gallery photos yet. Upload one above.</p>
        ) : (
          <div className="product-grid">
            {galleryImages.map((image) => (
              <div key={image._id} className="product-card">
                <img
                  src={getAssetUrl(image.imageUrl) || 'https://via.placeholder.com/260x180?text=Gallery'}
                  alt={image.title || 'Gallery'}
                />
                <h3>{image.title || 'Gallery Photo'}</h3>
                <button onClick={() => handleDeleteGallery(image._id)} className="logout-button">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
