import { useEffect, useState } from 'react';
import api, { getAssetUrl, handleImageError } from '../api';

const GalleryPage = ({ user }) => {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  
  // Admin state
  const isAdmin = user?.role === 'admin';
  const [galleryMsg, setGalleryMsg] = useState('');
  const [galleryForm, setGalleryForm] = useState({ title: '', imageFile: null });
  const [galleryUploading, setGalleryUploading] = useState(false);

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
      setImages((prev) => [response.data, ...prev]);
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
      setImages((prev) => prev.filter((img) => img._id !== id));
      setGalleryMsg('Gallery photo deleted.');
    } catch (error) {
      setGalleryMsg(error.response?.data?.message || 'Could not delete gallery photo.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Image Gallery</h1>
          <p>View product photos and gallery images for our wholesale mobile inventory.</p>
        </div>
      </header>

      {isAdmin && (
        <section className="hero-card" style={{ marginBottom: '2rem' }}>
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
      )}

      {message && !isAdmin && <p className="status-message">{message}</p>}
      
      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image._id} className="gallery-card">
            <img
              src={getAssetUrl(image.imageUrl)}
              alt={image.title || 'Gallery'}
              onError={handleImageError}
              loading="lazy"
            />
            <div>
              <h3>{image.title || 'Mobile Inventory'}</h3>
              {isAdmin && (
                <button onClick={() => handleDeleteGallery(image._id)} className="logout-button" style={{ marginTop: '10px' }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {!message && images.length === 0 && (
        <p className="status-message">No gallery photos have been added yet.</p>
      )}
    </div>
  );
};

export default GalleryPage;
