import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  getShops: () => apiClient.get('/restaurants'),
  getShopById: (id) => apiClient.get(`/restaurants/${id}`),
  getMenuByShopId: (shopId) => apiClient.get(`/menus?restaurant_id=${shopId}`),
  createMenu: (data) => apiClient.post('/menus', data),
  updateMenu: (id, data) => apiClient.put(`/menus/${id}`, data),
  deleteMenu: (id) => apiClient.delete(`/menus/${id}`),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getOrders: () => apiClient.get('/orders'),
  
  login: (creds) => apiClient.post('/login', creds), 
  
  createShop: (data) => apiClient.post('/restaurants', data),
  
  // ✅ ต้องมีบรรทัดนี้ครับ ถึงจะกดแก้ไขได้
  updateShop: (id, data) => apiClient.put(`/restaurants/${id}`, data),
  
  deleteShop: (id) => apiClient.delete(`/restaurants/${id}`),
  updateShopStatus: (id, data) => apiClient.put(`/restaurants/${id}/status`, data),
};

export default apiClient;