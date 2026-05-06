import axios from 'axios';

// Khởi tạo instance axios kết nối đến API Gateway
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Cổng của API Gateway
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động đính kèm Token vào Header nếu có
apiClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch (e) {
      console.error("Lỗi parse auth-storage:", e);
    }
  }
  return config;
});

export default apiClient;