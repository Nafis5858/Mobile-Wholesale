import { useEffect, useState } from 'react';
import api, { getAssetUrl } from '../api';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
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
        {images.map((image) => (
          <div key={image._id} className="gallery-card">
            <img src={getAssetUrl(image.imageUrl) || 'https://via.placeholder.com/360x260?text=Gallery'} alt={image.title || 'Gallery'} />
            <div>
              <h3>{image.title || 'Mobile Inventory'}</h3>
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
