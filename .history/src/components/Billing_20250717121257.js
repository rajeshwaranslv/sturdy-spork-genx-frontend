import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './billing.css';

function Billing({ match, history }) {
  const { orderId } = match.params;
  const [order, setOrder] = useState({
    waiter: { name: 'John Williams', table: 6 },
    items: [
      {
        id: 1,
        name: 'Chola Poori',
        category: 'Main Course',
        price: 240,
        quantity: 5,
        image: '/images/chola_poori.jpg',
      },
      {
        id: 2,
        name: 'Rava Dosa',
        category: 'Main Course',
        price: 120,
        quantity: 2,
        image: '/images/rava_dosa.jpg',
      },
    ],
  });

  const handleQuantityChange = (id, change) => {
    const updated = order.items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setOrder({ ...order, items: updated });
  };

  const getSubtotal = (item) => item.price * item.quantity;

  return (
    <div className="container-fluid">
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.goBack()} />
        <h2>GenX Cafe</h2>
        <FaFilter className="icon" />
      </div>

      <div className="waiter-card">
        <div className="waiter-left">
          <div className="waiter-name">{order.waiter.name}</div>
          <div className="waiter-role">Table {order.waiter.table}</div>
        </div>
        <div className="orders-count">
          <span className="order-red">Items {order.items.length}</span>
        </div>
      </div>

      <div className="table-section">
        <h2 className="section-title">Items</h2>
        <ul className="order-list">
          {order.items.map((item) => (
            <li key={item.id} className="item-row">
              <img src={item.image} alt={item.name} className="food-image" />
              <div className="item-info">
                <strong>{item.name}</strong>
                <div className="category">{item.category}</div>
              </div>
              <div className="qty-controls">
                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span className="qty-value">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
              <div className="item-price">₹{getSubtotal(item)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withRouter(Billing);
