import { useEffect, useState } from 'react';
import api from '../api';

const BlogPage = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState('');
  
  // Admin state
  const isAdmin = user?.role === 'admin';
  const [form, setForm] = useState({ title: '', summary: '' });
  const [blogMsg, setBlogMsg] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setArticles(response.data);
      } catch (error) {
        setMessage('Could not load blogs.');
      }
    };
    fetchBlogs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setBlogMsg('');
    try {
      const response = await api.post('/blogs', form);
      setArticles((prev) => [response.data, ...prev]);
      setForm({ title: '', summary: '' });
      setBlogMsg('✅ Blog created successfully.');
    } catch (error) {
      setBlogMsg(error.response?.data?.message || 'Could not create blog.');
    }
  };

  const handleDeleteBlog = async (id) => {
    setBlogMsg('');
    try {
      await api.delete(`/blogs/${id}`);
      setArticles((prev) => prev.filter((b) => b._id !== id));
      setBlogMsg('Blog deleted.');
    } catch (error) {
      setBlogMsg(error.response?.data?.message || 'Could not delete blog.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Blog & News</h1>
          <p>Industry news, product reviews, and wholesale market updates for trade buyers.</p>
        </div>
      </header>

      {isAdmin && (
        <section className="hero-card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Blog / News</h2>
          {blogMsg && <p className="status-message">{blogMsg}</p>}
          <form className="auth-card" onSubmit={handleCreateBlog}>
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleInputChange} required />
            <label>Summary / Content</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleInputChange}
              required
              rows="4"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', background: '#1e293b', color: '#fff', marginBottom: '15px' }}
            />
            <button type="submit">Create Blog</button>
          </form>
        </section>
      )}

      {message && !isAdmin && <p className="status-message">{message}</p>}

      <div className="blog-list">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article._id} className="blog-card" style={{ position: 'relative' }}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteBlog(article._id)}
                  className="logout-button"
                  style={{ marginTop: '15px' }}
                >
                  Delete Blog
                </button>
              )}
            </div>
          ))
        ) : (
          !message && <p className="status-message">No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
