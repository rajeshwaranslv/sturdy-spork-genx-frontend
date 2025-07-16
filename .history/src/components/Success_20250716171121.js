import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { updateTableStatus } from '../services/api';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './style.css'; // ✅ Use your shared styles

function Success({ history, location }) {
  const tableId = location.state?.tableId;

  useEffect(() => {
    if (tableId) {
      updateTableStatus(tableId, { status: 'available' })
        .then(() => console.log(`✅ Table ${tableId} marked available`))
        .catch(err => console.error('❌ Failed to update table status:', err));
    }
  }, [tableId]);

  return (
    <div className="container-fluid success-wrapper">
      {/* ✅ Sticky Header */}
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.push('/')} />
        <h2>GenX Cafe</h2>
        <FaFilter className="icon" />
      </div>

      {/* ✅ Confirmation Block */}
      <div className="confirmation-card">
        <div className="checkmark-circle">
          <div className="checkmark" />
        </div>
        <h2 className="success-message">Your order has been completed successfully</h2>
      </div>

      {/* ✅ Fixed CTA */}
      <button className="footer-btn" onClick={() => history.push('/')}>
        Book Another Table
      </button>
    </div>
  );
}

export default withRouter(Success);
