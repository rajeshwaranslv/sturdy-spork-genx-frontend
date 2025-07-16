import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { updateTableStatus } from '../services/api';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './success.css';

function Success({ history, location }) {
  const tableId = location.state?.tableId;

  useEffect(() => {
    if (tableId) {
      updateTableStatus(tableId, { status: 'available' })
        .then(() => console.log(`✅ Table ${tableId} marked available`))
        .catch(err => console.error('❌ Failed to update table status:', err));
    }
  }, [tableId]);

  const waiter = {
    name: 'John Williams',
    role: 'Waiter',
    floor: 'Ground Floor',
    tableId: tableId ?? '--',
  };

  return (
    <div className="container-fluid">
      {/* ✅ Header */}
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.push('/')} />
        <h2>GenX Cafe</h2>
        <FaFilter className="icon" />
      </div>

      {/* ✅ Waiter Card */}
      <div className="waiter-card">
        <div className="waiter-left">
          <strong className="waiter-name">{waiter.name}</strong>
          <div className="waiter-role">Role: {waiter.role}</div>
        </div>
        <div className="waiter-right">
          <div className="floor-label">{waiter.floor}</div>
          <div className="orders-count">
            Table: <span className="order-red">{waiter.tableId}</span>
          </div>
        </div>
      </div>

      {/* ✅ Success Body */}
      <div className="table-section">
        <div className="checkmark-circle">
          <div className="checkmark" />
        </div>
        <h2 className="success-text" style={}>Your order is completed successfully</h2>
      </div>

      {/* ✅ Footer Button */}
      <button className="footer-btn" onClick={() => history.push('/')}>
        Book Table
      </button>
    </div>
  );
}

export default withRouter(Success);
