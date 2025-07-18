.order-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.food-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.item-info strong {
  font-size: 16px;
  margin-bottom: 4px;
}

.category {
  font-size: 12px;
  color: #666;
}

.qty-controls {
  display: flex;
  align-items: center;
  background-color: #eaf9ef;
  border: 1px solid #36b37e;
  border-radius: 8px;
  overflow: hidden;
  height: 36px;
  margin: 0 12px;
}

.qty-controls button {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  width: 32px;
  height: 100%;
  color: #36b37e;
  cursor: pointer;
}

.qty-value {
  width: 32px;
  text-align: center;
  font-weight: bold;
  color: #222;
}

.item-price {
  font-weight: bold;
  font-size: 16px;
  color: #111;
}
