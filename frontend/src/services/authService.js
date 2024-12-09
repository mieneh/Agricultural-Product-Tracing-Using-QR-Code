import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password, rememberMe = false) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    sessionStorage.getItem('token', response.data.token)

    if (rememberMe) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message || 'Đăng nhập thất bại');
    } else {
      throw new Error('Không thể kết nối đến server.');
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Không thể kết nối đến server.');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const isLoggedIn = () => !!getToken();

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getProfile = async () => {
  const res = await axios.get(`${API_URL}/auth/profile`, authHeader());
  return res.data.user;
};

export const updateProfile = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  const res = await axios.put(`${API_URL}/auth/profile`, formData, authHeader());
  return res.data.user;
};

export const changePassword = async (data) => {
  await axios.put(`${API_URL}/auth/change-password`, data, authHeader());
};