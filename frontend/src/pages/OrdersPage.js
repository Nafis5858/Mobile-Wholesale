import { useEffect, useState } from 'react';
import api from '../api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

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
        </div>
        {orders.map((order) => (
          <div key={order._id} className="orders-row">
            <div>{order.product?.name || 'Unknown'}</div>
            <div>{order.quantity}</div>
            <div>Tk {order.totalPrice.toFixed(2)}</div>
            <div>{order.status}</div>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
