import { useEffect, useState } from 'react';
import api from '../api';

const AdminContactPage = () => {
  const [contact, setContact] = useState({ email: '', phone: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await api.get('/admin/site');
        setContact(response.data.contact);
      } catch (error) {
        setMessage('Could not load contact info.');
      }
    };
    loadContact();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await api.put('/admin/site/contact', contact);
      setContact(response.data.contact);
      setMessage('Contact information updated.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update contact info.');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Edit Contact Information</h1>
          <p>Update the site contact details visible to buyers.</p>
        </div>
      </header>
      {message && <p className="status-message">{message}</p>}
      <form className="auth-card" onSubmit={handleSave}>
        <label>Email</label>
        <input name="email" value={contact.email} onChange={handleChange} required />
        <label>Phone</label>
        <input name="phone" value={contact.phone} onChange={handleChange} required />
        <label>Address</label>
        <input name="address" value={contact.address} onChange={handleChange} required />
        <button type="submit">Save Contact Info</button>
      </form>
    </div>
  );
};

export default AdminContactPage;
