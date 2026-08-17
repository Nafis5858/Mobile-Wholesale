import { useEffect, useState } from 'react';
import api from '../api';

const StarRating = ({ value, onChange }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star-btn${value >= star ? ' active' : ''}`}
        onClick={() => onChange(star)}
        aria-label={`Rate ${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

const ReviewForm = ({ orderId, onReviewed }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setMsg('Please select a star rating.'); return; }
    if (!comment.trim()) { setMsg('Please write a comment.'); return; }
    setSubmitting(true);
    setMsg('');
    try {
      await api.post(`/orders/${orderId}/review`, { rating, comment });
      setMsg('✅ Review submitted! Thank you.');
      onReviewed(orderId);
    } catch (error) {
      setMsg(error.response?.data?.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <p className="review-form-title">⭐ Leave a Review</p>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        className="review-textarea"
        placeholder="Share your experience with this order..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      {msg && <p className="status-message" style={{ marginTop: 0 }}>{msg}</p>}
      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [openReview, setOpenReview] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        setMessage('Could not load orders.');
      }
    };
    loadOrders();
  }, []);

  const handleReviewed = (orderId) => {
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, hasReview: true } : o));
    setOpenReview(null);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>My Orders</h1>
          <p>Check the orders you placed for wholesale items.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <div className="orders-table">
        <div className="orders-row header">
          <div>Product</div>
          <div>Qty</div>
          <div>Total</div>
          <div>Status</div>
          <div>Date</div>
          <div>Review</div>
        </div>
        {orders.map((order) => (
          <div key={order._id}>
            <div className="orders-row">
              <div>{order.product?.name || 'Unknown'}</div>
              <div>{order.quantity}</div>
              <div>Tk {order.totalPrice.toFixed(2)}</div>
              <div>
                <span className={`order-status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div>
                {order.hasReview ? (
                  <span className="review-done-badge">✅ Reviewed</span>
                ) : (
                  <button
                    className="button"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    onClick={() => setOpenReview(openReview === order._id ? null : order._id)}
                  >
                    {openReview === order._id ? 'Cancel' : 'Write Review'}
                  </button>
                )}
              </div>
            </div>
            {openReview === order._id && (
              <ReviewForm orderId={order._id} onReviewed={handleReviewed} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
