import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      setOrders(response.data);
    } catch (error) {
      setMessage('Could not load orders.');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setLoadingId(orderId);
    setMessage('');
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      setMessage('Could not update order status.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Manage Orders</h1>
          <p>Review and approve or reject incoming wholesale orders.</p>
        </div>
      </header>

      {message && <p className="status-message">{message}</p>}

      <div className="orders-table-wrapper" style={{ overflowX: 'auto', background: 'var(--surface-2)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
              <th style={{ padding: '16px', color: 'var(--text-2)' }}>Date</th>
              <th style={{ padding: '16px', color: 'var(--text-2)' }}>Buyer Info</th>
              <th style={{ padding: '16px', color: 'var(--text-2)' }}>Product</th>
              <th style={{ padding: '16px', color: 'var(--text-2)' }}>Qty</th>
              <th style={{ padding: '16px', color: 'var(--text-2)' }}>Total (Tk)</th>
              <th style={{ padding: '16px', color: 'var(--text-2)' }}>Status</th>
              <th style={{ padding: '16px', color: 'var(--text-2)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>{order.user?.name || 'Unknown User'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>{order.user?.phone}</div>
                </td>
                <td style={{ padding: '16px' }}>{order.product?.name || 'Unknown Product'}</td>
                <td style={{ padding: '16px' }}>{order.quantity}</td>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{order.totalPrice.toFixed(2)}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`order-status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  {order.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        className="button" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'var(--success)' }}
                        onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                        disabled={loadingId === order._id}
                      >
                        Accept
                      </button>
                      <button 
                        className="button" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'var(--danger)' }}
                        onClick={() => handleUpdateStatus(order._id, 'rejected')}
                        disabled={loadingId === order._id}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>No pending action</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
