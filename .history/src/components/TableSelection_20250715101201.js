import React, { useEffect, useState } from 'react';
import { getTables } from '../services/api';
import { withRouter } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './style.css';

function TableSelection({ history }) {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const waiter = {
    name: 'John Williams',
    role: 'Waiter',
    floor: 'Ground Floor',
    orders: 25,
  };

  useEffect(() => {
    getTables()
      .then((res) => setTables(res.data))
      .catch((err) => console.error('Failed to fetch tables', err));
  }, []);

  const handleTableClick = (id, status) => {
    if (status === 'available') {
      setSelectedTableId(id === selectedTableId ? null : id); // Toggle
    }
  };

  const handleSelectTable = () => {
    if (selectedTableId) {
      history.push(`/menu/${selectedTableId}`);
    }
  };

  return (
    <div className="container">
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.goBack()} />
        <h2>GenX Cafe</h2>
        <FaFilter className="icon" />
      </div>

      <div className="waiter-card">
        <div className="waiter-left">
          <strong className="waiter-name">{waiter.name}</strong>
          <div className="waiter-role">Role: {waiter.role}</div>
        </div>
        <div className="waiter-right">
          <div className="floor-label">{waiter.floor}</div>
          <div className="orders-count">
            Orders: <span className="order-red">{waiter.orders}</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="legend-row">
          <div><span className="legend-dot green" /> Available</div>
          <div><span className="legend-dot purple" /> Selected</div>
          <div><span className="legend-dot red" /> Not - Available</div>
        </div>

        <div className="table-grid">
          {tables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const statusClass =
              table.status === 'available'
                ? isSelected
                  ? 'selected'
                  : 'available'
                : 'occupied';

            return (
              <button
                key={table.id}
                className={`table-btn ${statusClass}`}
                onClick={() => handleTableClick(table.id, table.status)}
                disabled={table.status === 'occupied'}
              >
                Table {table.id.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>


    </div>
  );
}

export default withRouter(TableSelection);
