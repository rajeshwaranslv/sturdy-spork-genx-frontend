import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './billing.css';

function Billing({ match, history }) {
  const { orderId } = match.params;
  const [order, setOrder] = useState({
    waiter: {
      name: 'John Williams',
      table: 6,
    },
    items: [
      { id: 1, name: 'Cappuccino', price: 3.5, quantity: 1 },
    ],
  });

  const handleQuantityChange = (id, newQty) => {
    const updated = order.items.map(item =>
      item.id === id ? { ...item, quantity: parseInt(newQty) || 1 } : item
    );
    setOrder({ ...order, items: updated });
  };

  const handleBack = () => history.goBack();

  return (
    <div className="container-fluid">
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={handleBack} />
        <h2>GenX Cafe</h2>
        <FaFilter className="icon" />
      </div>

      <div className="waiter-card">
        <div className="waiter-left">
          <div className="waiter-name">{order.waiter.name}</div>
          <div className="waiter-role">Table {order.waiter.table}</div>
        </div>
        <div className="orders-count">
          <span className="order-red">Items {order.items.length.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="table-section">
        <h2>Items Ordered</h2>
        <ul className="order-list">
          {order.items.map((item) => (
            <li key={item.id} className="item-row">
              <div className="item-info">
                <strong>{item.name}</strong>
                <p>₹ {item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="qty-input"
                />
                <button
                  className="qty-btn"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button className="select-btn">Generate Bill</button>
      </div>
    </div>
  );
}

export default withRouter(Billing);
