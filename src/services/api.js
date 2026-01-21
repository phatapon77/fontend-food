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
  
  // ✅ แก้ตรงนี้ครับ (จาก /auth/login เป็น /login เฉยๆ)
  // เพราะ baseURL เรามี /api อยู่แล้ว พอมารวมกันจะเป็น /api/login ตรงกับ Backend พอดีครับ
  login: (creds) => apiClient.post('/login', creds), 
  
  createShop: (data) => apiClient.post('/restaurants', data),
  deleteShop: (id) => apiClient.delete(`/restaurants/${id}`),
};

export default apiClient;