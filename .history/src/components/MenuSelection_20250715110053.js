import React, { useEffect, useState } from 'react';
import { getFoodItems, placeOrder, updateTableStatus } from '../services/api';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './style.css';

function MenuSelection({ match, history }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const { tableId } = match.params;

  useEffect(() => {
    let mounted = true;
    getFoodItems()
      .then((res) => {
        if (mounted) {
          setItems(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('❌ Failed to load food items:', err);
        alert('Failed to load menu. Please check your connection or backend.');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleItem = (item) => {
    const exists = selected.find((i) => i.id === item.id);
    if (exists) {
      setSelected(selected.filter((i) => i.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleOrder = async () => {
    const orderData = {
      tableId: parseInt(tableId),
      items: selected.map((item) => ({
        foodItemId: item.id,
        quantity: 1,
      })),
    };

    try {
      setPlacingOrder(true);
      const res = await placeOrder(orderData);
      await updateTableStatus(tableId, { status: 'occupied' });
      history.push(`/orders/${res.data.id}`);
    } catch (err) {
      console.error('❌ Order failed:', err.response?.data || err.message);
      alert(`Order failed: ${err.response?.data?.details || err.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading menu...</p></div>;
  }

  return (
    <div className="container">
      {/* Custom Header */}
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.goBack()} />
        <h2>GenX Cafe</h2>
        <div />
      </div>

      {/* Waiter Info */}
      <div className="waiter-card">
        <div className="waiter-left">
          <strong className="waiter-name">John Williams</strong>
          <div className="waiter-role">Role: Waiter</div>
        </div>
        <div className="waiter-right">
          <div className="floor-label">Ground Floor</div>
          <div className="orders-count">
            Items: <span className="order-red">{selected.length}</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`menu-card ${selected.find(i => i.id === item.id) ? 'selected' : ''}`}
          >
            <img
              src={`https://source.unsplash.com/100x100/?${item.name}`}
              alt={item.name}
            />
            <h4>{item.name}</h4>
            <p className="desc">{item.description}</p>
            <p><strong>₹ {item.price.toFixed(2)}</strong></p>
            <button onClick={() => toggleItem(item)}>
              {selected.find((i) => i.id === item.id) ? 'REMOVE' : 'ADD'}
            </button>
          </div>
        ))}
      </div>

      <button
        className="footer-btn"
        onClick={handleOrder}
        disabled={selected.length === 0 || placingOrder}
      >
        {placingOrder ? 'Placing Order...' : 'Take Order'}
      </button>
    </div>
  );
}

export default withRouter(MenuSelection);
