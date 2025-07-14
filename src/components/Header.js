import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import './style.css';

export default function Header({ table, itemsCount }) {
  const history = useHistory();

  return (
    <div className="header">
      <div className="header-top">
        <FaArrowLeft className="icon" onClick={() => history.goBack()} />
        <h2>GenX Cafe</h2>
        <FaFilter className="icon" onClick={() => alert('Filter clicked')} />
      </div>

      <div className="waiter-badge">👨‍🍳 Waiter</div>

      <div className="header-info">
        <div>
          <strong>Table {table}</strong><br />
          <small>Items: {itemsCount?.toString().padStart(2, '0')}</small>
        </div>
      </div>
    </div>
  );
}
