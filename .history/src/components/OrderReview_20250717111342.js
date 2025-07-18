import React, { useEffect, useState } from 'react';
import { getOrder, getFoodItems, updateOrderItemStatus } from '../services/api';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import { Switch } from 'antd';
import './order.css'; // ✅ Reusing common styles

function OrderReview({ match, history }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = match.params;

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
            status: item.status || 'ordered'
          };
        });

        if (isMounted) {
          setOrder({ ...orderRes.data, items: enrichedItems });
        }
      } catch (err) {
        console.error('❌ Failed to load order or food items:', err);
        alert('Failed to load order.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [orderId]);

  const toggleStatus = async (itemId, checked) => {
    try {
      await updateOrderItemStatus(orderId, {
        itemId,
        status: checked ? 'served' : 'ordered'
      });

      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, status: checked ? 'served' : 'ordered' } : item
        ),
      }));
    } catch (err) {
      console.error('❌ Failed to update item status:', err);
      alert('Failed to update item status');
    }
  };

  if (loading) return <div className="container-fluid"><p style={{ color: 'white', marginTop: '100px', textAlign: 'center' }}>Loading order...</p></div>;
  if (!order || !order.items || order.items.length === 0) {
    return <div className="container-fluid"><p style={{ color: 'white', marginTop: '100px', textAlign: 'center' }}>No items in this order.</p></div>;
  }

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
              <h2 style={{marginLeft:"1rem",marginBottom:"1rem"}}>Items Ordered</h2>
        {order.items.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-info" >
              <strong>{item.foodItemName}</strong>
              <p>₹ {(item.price || 0).toFixed(2)} × {item.quantity}</p>
            </div>
            <div className="item-status">
              <Switch
                checked={item.status === 'served'}
                onChange={(checked) => toggleStatus(item.id, checked)}
              />
              <span className={`status-label ${item.status === 'served' ? 'served' : 'ordered'}`}>
                {item.status === 'served' ? 'Served' : 'Ordered'}
              </span>
            </div>
          </div>
        ))}

        {/* ✅ Button */}
        <button className="select-btn" onClick={() => history.push(`/billing/${order.id}`)}>
          Generate Bill
        </button>
      </div>
    </div>
  );
}

export default withRouter(OrderReview);
