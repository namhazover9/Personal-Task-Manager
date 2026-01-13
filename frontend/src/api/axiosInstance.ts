import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: '/api', // nhờ proxy ở vite.config.ts
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: xử lý lỗi chung (ví dụ 401 -> logout)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // toast.error('Bạn không có quyền truy cập tính năng này.');
    } else if (error.response?.data?.message) {
      // toast.error(error.response.data.message);
    } else {
      // toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;