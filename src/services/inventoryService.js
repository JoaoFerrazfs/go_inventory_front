import api from '../client/api';

export const listInventories = () => api.get('/inventories/');

export const createInventory = (data) => api.post('/inventories/', data);

export const getInventory = (id) => api.get(`/inventories/${id}/`);

export const updateInventory = (id, data) => api.put(`/inventories/${id}/`, data);