import React, { useEffect, useState } from 'react';
import { getTables, getOrders } from '../services/api'; // ✅ updated
import { withRouter } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import { Dropdown, Checkbox, Menu } from 'antd';
import './style.css';

function TableSelection({ history }) {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [filter, setFilter] = useState({
    available: true,
    selected: true,
    occupied: true,
  });
  const [totalOrders, setTotalOrders] = useState(0); // ✅ state for orders count

  const waiter = {
    name: 'John Williams',
    role: 'Waiter',
    floor: 'Ground Floor',
  };

  useEffect(() => {
    getTables()
      .then((res) => setTables(res.data))
      .catch((err) => console.error('Failed to fetch tables', err));

    getOrders()
      .then((res) => {
        const total = Array.isArray(res.data) ? res.data.length : 0;
        setTotalOrders(total);
      })
      .catch((err) => console.error('Failed to fetch orders', err));
  }, []);

  const handleTableClick = (id, status) => {
    if (status === 'available') {
      setSelectedTableId(id === selectedTableId ? null : id);
    }
  };

  const handleSelectTable = () => {
    if (selectedTableId) {
      history.push(`/menu/${selectedTableId}`);
    }
  };

  const filterMenu = (
    <Menu>
      <Menu.Item>
        <Checkbox
          checked={filter.available}
          onChange={(e) => setFilter({ ...filter, available: e.target.checked })}
        >
          Available
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox
          checked={filter.selected}
          onChange={(e) => setFilter({ ...filter, selected: e.target.checked })}
        >
          Selected
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox
          checked={filter.occupied}
          onChange={(e) => setFilter({ ...filter, occupied: e.target.checked })}
        >
          Not Available
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="container-fluid">
      {/* ✅ Header */}
      <div className="header-bar">
        <FaArrowLeft className="icon" onClick={() => history.goBack()} />
        <h2>GenX Cafe</h2>
        <Dropdown overlay={filterMenu} trigger={['click']}>
          <FaFilter className="icon" style={{ cursor: 'pointer', marginLeft: 'auto' }} />
        </Dropdown>
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
            Orders: <span className="order-red">{totalOrders}</span>
          </div>
        </div>
      </div>

      {/* ✅ White Rounded Container */}
      <div className="table-section">
        <div className="legend-row">
          <div className="legend-item"><span className="legend-dot green" /> Available</div>
          <div className="legend-item"><span className="legend-dot purple" /> Selected</div>
          <div className="legend-item"><span className="legend-dot red" /> Not - Available</div>
        </div>

        <div className="table-grid">
          {tables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const statusClass = isSelected
              ? 'selected'
              : table.status === 'available'
              ? 'available'
              : 'occupied';

            if (
              (statusClass === 'available' && !filter.available) ||
              (statusClass === 'selected' && !filter.selected) ||
              (statusClass === 'occupied' && !filter.occupied)
            ) {
              return null;
            }

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

        <button
          className="select-btn"
          onClick={handleSelectTable}
          disabled={!selectedTableId}
        >
          Select Table
        </button>
      </div>
    </div>
  );
}

export default withRouter(TableSelection);
