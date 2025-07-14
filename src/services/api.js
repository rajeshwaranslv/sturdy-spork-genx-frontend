import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/',
});

export const getTables = () => API.get('/tables');
export const getTableDetails = (id) => API.get(`/tables/${id}`);
export const getFoodItems = () => API.get('/foodItems');

export const placeOrder = (data) => API.post('/orders', data);
export const updateOrderItemStatus = (id, payload) => API.patch(`/orders/${id}`, payload);
export const getOrder = (id) => API.get(`/orders/${id}`);
export const generateBill = (data) => API.post('/bills', data);

// ✅ NEW: Update table status
export const updateTableStatus = (id, payload) => API.patch(`/tables/${id}`, payload);
