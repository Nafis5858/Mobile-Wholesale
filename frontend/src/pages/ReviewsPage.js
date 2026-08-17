import { useEffect, useState } from 'react';
import api from '../api';

const StarDisplay = ({ rating }) => (
  <span className="star-display">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>
    ))}
  </span>
);

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await api.get('/orders/reviews/all');
        setReviews(response.data);
      } catch {
        setMessage('Could not load reviews.');
      }
    };
    loadReviews();
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Customer Reviews</h1>
          <p>Real feedback from our verified wholesale buyers.</p>
        </div>
        {avgRating && (
          <div className="reviews-avg-badge">
            <span className="reviews-avg-number">{avgRating}</span>
            <StarDisplay rating={Math.round(avgRating)} />
            <span className="reviews-avg-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </header>

      {message && <p className="status-message">{message}</p>}

      {reviews.length === 0 && !message ? (
        <div className="hero-card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            No reviews yet. Be the first to leave one after placing an order!
          </p>
        </div>
      ) : (
        <div className="blog-list" style={{ width: '100%', maxWidth: '1200px' }}>
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-card-header">
                <div className="review-avatar">
                  {(review.buyerName || 'B')[0].toUpperCase()}
                </div>
                <div>
                  <p className="review-buyer-name">{review.buyerName || 'Buyer'}</p>
                  {review.product && (
                    <p className="review-product-tag">
                      📦 {review.product.name} · {review.product.brand}
                    </p>
                  )}
                </div>
                <div className="review-card-right">
                  <StarDisplay rating={review.rating} />
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
