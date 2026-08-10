const ReviewsPage = () => {
  const reviews = [
    { company: 'Trade Buyer A', rating: 5, comment: 'Great wholesale prices and fast dispatch. Very reliable supplier.' },
    { company: 'Retailer B', rating: 4, comment: 'Good stock availability and responsive support team.' },
    { company: 'Distributor C', rating: 5, comment: 'Excellent trade account service and competitive pricing.' },
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Reviews</h1>
          <p>Read verified feedback from our trade partners and wholesale buyers.</p>
        </div>
      </header>
      <div className="blog-list">
        {reviews.map((review) => (
          <div key={review.company} className="blog-card">
            <h3>{review.company}</h3>
            <p><strong>Rating:</strong> {review.rating} / 5</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
