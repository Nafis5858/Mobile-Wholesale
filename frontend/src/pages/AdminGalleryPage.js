import { useEffect, useState } from 'react';
import api from '../api';

const AdminGalleryPage = () => {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ title: '', imageUrl: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await api.get('/admin/gallery');
        setImages(response.data);
      } catch (error) {
        setMessage('Could not load gallery images.');
      }
    };
    loadImages();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/admin/gallery', form);
      setImages((prev) => [response.data, ...prev]);
      setForm({ title: '', imageUrl: '' });
      setMessage('Image added to gallery.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add gallery image.');
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    try {
      await api.delete(`/admin/gallery/${id}`);
      setImages((prev) => prev.filter((image) => image._id !== id));
      setMessage('Image deleted.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete gallery image.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Manage Gallery</h1>
          <p>Add or remove images shown on the site.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <form className="auth-card" onSubmit={handleCreate}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
        <label>Image URL</label>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
        <button type="submit">Add Image</button>
      </form>
      <div className="product-grid">
        {images.map((image) => (
          <div key={image._id} className="product-card">
            <img src={image.imageUrl} alt={image.title || 'Gallery'} />
            <h3>{image.title || 'Gallery Image'}</h3>
            <button className="logout-button" onClick={() => handleDelete(image._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
