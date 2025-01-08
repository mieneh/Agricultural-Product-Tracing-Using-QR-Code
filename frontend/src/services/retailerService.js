import request from '../utils/request';

export const getRetailers = async () => {
  const res = await request.get('/retailers');
  return res.data;
};

export const createRetailer = async (data) => {
  const res = await request.post('/retailers', data);
  return res.data;
};

export const updateRetailer = async (id, data) => {
  const res = await request.put(`/retailers/${id}`, data);
  return res.data;
};

export const deleteRetailer = async (id) => {
  const res = await request.delete(`/retailers/${id}`);
  return res.data;
};