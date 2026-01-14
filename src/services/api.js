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
  login: (creds) => apiClient.post('/auth/login', creds), // Mock placeholder
};
export default apiClient;