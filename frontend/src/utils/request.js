import axios from 'axios';

const request = axios.create({baseURL: process.env.REACT_APP_API_URL});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default request;