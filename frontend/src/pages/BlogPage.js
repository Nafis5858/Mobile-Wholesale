const BlogPage = () => {
  const articles = [
    {
      title: 'Wholesale Mobile Trends 2026',
      summary: 'Understand the latest demand, pricing, and trade opportunities in the Bangladesh market.',
    },
    {
      title: 'How to Buy Mobile Stock in Bulk',
      summary: 'A quick guide for wholesalers to place smarter orders and manage inventory efficiently.',
    },
    {
      title: 'Tips for Trade Buyers',
      summary: 'Learn how to negotiate better prices, verify suppliers, and keep shipment costs low.',
    },
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Blog & News</h1>
          <p>Industry news, product reviews, and wholesale market updates for trade buyers.</p>
        </div>
      </header>
      <div className="blog-list">
        {articles.map((article) => (
          <div key={article.title} className="blog-card">
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
