// src/pages/MenuSelection.js
import React, { useEffect, useState } from 'react';
import { getFoodItems, placeOrder, updateTableStatus } from '../services/api';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './menu.css'; // ✅ reuse same style.css from TableSelection
imp

function MenuSelection({ match, history }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { tableId } = match.params;

  const waiter = {
    name: 'John Williams',
    role: 'Waiter',
    floor: 'Ground Floor',
    items: selected.length,
  };

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
    return <div className="container-fluid"><p style={{ color: 'white', textAlign: 'center' }}>Loading menu...</p></div>;
  }

  return (
    <div className="container-fluid">
      {/* ✅ Header */}
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.goBack()} />
        <h2>GenX Cafe</h2>
        <div />
      </div>

      {/* ✅ Floating Waiter Card */}
      <div className="waiter-card">
        <div className="waiter-left">
          <strong className="waiter-name">{waiter.name}</strong>
          <div className="waiter-role">Role: {waiter.role}</div>
        </div>
        <div className="waiter-right">
          <div className="floor-label">{waiter.floor}</div>
          <div className="orders-count">
            Items: <span className="order-red">{waiter.items}</span>
          </div>
        </div>
      </div>

      {/* ✅ White Rounded Menu Section */}
      <div className="table-section">
        <h2 style={{marginLeft:"1rem",marginBottom:"1rem"}}>Items Available</h2>
        <div className="table-grid">
          {items.map((item) => {
            const isSelected = selected.some((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                className={`menu-card table-btn ${isSelected ? 'selected' : 'available'}`}
                onClick={() => toggleItem(item)}
              >
                <img
                  src={`https://source.unsplash.com/100x100/?${item.name}`}
                  alt={item.name}
                />
                <h4>{item.name}</h4>
                <p className="desc">{item.description}</p>
                <p><strong>₹ {item.price.toFixed(2)}</strong></p>
                <button className="mini-btn">
                  {isSelected ? 'REMOVE' : 'ADD'}
                </button>
              </div>
            );
          })}
        </div>

        {/* ✅ Footer Order Button */}
        <button
          className="select-btn"
          onClick={handleOrder}
          disabled={selected.length === 0 || placingOrder}
        >
          {placingOrder ? 'Placing Order...' : 'Take Order'}
        </button>
      </div>
    </div>
  );
}

export default withRouter(MenuSelection);
