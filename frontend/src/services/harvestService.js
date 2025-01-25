import axios from 'axios';
import request from '../utils/request';

const API_URL = process.env.REACT_APP_API_URL;

export const getHarvests = async () => {
  const res = await request.get('/harvests');
  return res.data;
};

export const createHarvest = async (data) => {
  const res = await request.post('/harvests', data);
  return res.data;
};

export const updateHarvest = async (id, data) => {
  const res = await request.put(`/harvests/${id}`, data);
  return res.data;
};

export const deleteHarvest = async (id) => {
  const res = await request.delete(`/harvests/${id}`);
  return res.data;
};

export const getAllHarvests = async () => {
  const res = await axios.get(`${API_URL}/harvests/harvest`);
  return res.data.data;
};

export const getOrders = async () => {
  const res = await request.get('/harvests/order');
  return res.data;
};