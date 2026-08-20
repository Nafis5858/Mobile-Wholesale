import { useEffect, useState } from 'react';
import api from '../api';

const BlogPage = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState('');
  
  // Admin state
  const isAdmin = user?.role === 'admin';
  const [form, setForm] = useState({ title: '', summary: '' });
  const [blogMsg, setBlogMsg] = useState('');

  // Edit state
  const [editingBlog, setEditingBlog] = useState(null);
  const [editBlogForm, setEditBlogForm] = useState({ title: '', summary: '' });
  const [editBlogMsg, setEditBlogMsg] = useState('');
  const [editBlogLoading, setEditBlogLoading] = useState(false);

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

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setEditBlogForm({ title: blog.title || '', summary: blog.summary || '' });
    setEditBlogMsg('');
  };

  const handleCloseEdit = () => {
    setEditingBlog(null);
    setEditBlogMsg('');
  };

  const handleEditBlogChange = (e) => {
    const { name, value } = e.target;
    setEditBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEditBlog = async (e) => {
    e.preventDefault();
    if (!editingBlog) return;
    setEditBlogMsg('');
    setEditBlogLoading(true);

    try {
      const response = await api.put(`/blogs/${editingBlog._id}`, editBlogForm);
      setArticles((prev) => prev.map((b) => (b._id === editingBlog._id ? response.data : b)));
      setBlogMsg('✅ Blog updated successfully.');
      handleCloseEdit();
    } catch (error) {
      setEditBlogMsg(error.response?.data?.message || 'Could not update blog.');
    } finally {
      setEditBlogLoading(false);
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
                <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleOpenEdit(article)}
                    className="button button-edit"
                    style={{ flex: 1 }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(article._id)}
                    className="logout-button"
                    style={{ flex: 1 }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          !message && <p className="status-message">No articles found.</p>
        )}
      </div>

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="modal-backdrop" onClick={handleCloseEdit}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Blog / News</h2>
              <button className="modal-close-btn" onClick={handleCloseEdit}>✕</button>
            </div>
            {editBlogMsg && <p className="status-message">{editBlogMsg}</p>}
            <form className="auth-card" onSubmit={handleSaveEditBlog} style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent' }}>
              <label>Title</label>
              <input
                name="title"
                value={editBlogForm.title}
                onChange={handleEditBlogChange}
                required
              />
              <label>Summary / Content</label>
              <textarea
                name="summary"
                value={editBlogForm.summary}
                onChange={handleEditBlogChange}
                required
                rows="5"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #334155', background: '#1e293b', color: '#fff', marginBottom: '15px' }}
              />
              <div className="modal-actions">
                <button type="button" className="button button-secondary" onClick={handleCloseEdit}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={editBlogLoading}>
                  {editBlogLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
