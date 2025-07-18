import React, { useEffect, useState } from 'react';
import { getOrder, getFoodItems, generateBill } from '../services/api';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './billing.css';

function Billing({ match, history }) {
  const { orderId } = match.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [orderRes, foodRes] = await Promise.all([
          getOrder(orderId),
          getFoodItems()
        ]);

        const foodMap = {};
        foodRes.data.forEach(item => {
          foodMap[item.id] = item;
        });

        const enrichedItems = orderRes.data.items.map((item, index) => {
          const food = foodMap[item.foodItemId] || {};
          return {
            id: item.id || index + 1,
            foodItemId: item.foodItemId,
            foodItemName: item.foodItemName || food.name || 'Unknown',
            quantity: item.quantity || 1,
            price: item.price ?? food.price ?? 0,
          };
        });

        if (isMounted) {
          setOrder({ ...orderRes.data, items: enrichedItems });
        }
      } catch (err) {
        console.error('❌ Failed to fetch order or food items', err);
        alert('Failed to load bill');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false };
  }, [orderId]);

  const handleQuantityChange = (itemId, type) => {
    setOrder(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const newQty = type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const completeOrder = async () => {
    await generateBill({
      orderId: order.id,
      customerName: 'Customer',
      customerPhone: '0000000000'
    });
    history.push('/success', { tableId: order.tableId });
  };

  if (loading || !order) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>
        <div className="spinner" />
        <p>Loading bill...</p>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cgst = subtotal * 0.05;
  const sgst = subtotal * 0.05;
  const total = subtotal + cgst + sgst;

return (
  <div className="container-fluid">
    {/* ✅ Header */}
    <div className="header-bar">
      <FaArrowLeft className="icon" onClick={() => history.goBack()} />
      <h2>GenX Cafe</h2>
      <FaFilter className="icon" />
    </div>

    {/* ✅ Floating Waiter Card */}
    <div className="waiter-card">
      <div className="waiter-left">
        <strong className="waiter-name">John Williams</strong>
        <div className="waiter-role">Table {order.tableId}</div>
      </div>
      <div className="waiter-right">
        <div className="floor-label">Items</div>
        <div className="orders-count">
          <span className="order-red">{order.items.length.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>

    {/* ✅ Scrollable White Section */}
    <div className="table-section">
            <h2>Items Available</h2>
      <ul className="order-list">
        {order.items.map((item) => (
          <li key={item.id} className="item-row">
            <div className="item-info">
              <strong>{item.foodItemName}</strong>
              <p>₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div className="item-status">
              <div className="qty-controls">
                <button onClick={() => handleQuantityChange(item.id, 'dec')} className="qty-btn">−</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 'inc')} className="qty-btn">+</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ Invoice Summary */}
      <div className="invoice-summary">
        <p><strong style={{ fontSize: '20px' }}>Invoice Summary</strong></p>
        <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
        <p><strong>CGST (5%):</strong> ₹{cgst.toFixed(2)}</p>
        <p><strong>SGST (5%):</strong> ₹{sgst.toFixed(2)}</p>
        <p style={{ fontSize: '18px' }}><strong>Total:</strong> ₹{total.toFixed(2)}</p>
      </div>

      {/* ✅ Footer Button */}
      <button className="select-btn" onClick={completeOrder}>
        Complete Order
      </button>
    </div>
  </div>
);

}

export default withRouter(Billing);
