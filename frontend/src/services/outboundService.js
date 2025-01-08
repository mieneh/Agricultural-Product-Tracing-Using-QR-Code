import request from '../utils/request';

export const getOutbounds = async () => {
  const res = await request.get('/outbounds');
  return res.data;
};

export const createOutbound = async (data) => {
  const res = await request.post('/outbounds', data);
  return res.data;
};

export const updateOutbound = async (id, data) => {
  const res = await request.put(`/outbounds/${id}`, data);
  return res.data;
};

export const deleteOutbound = async (id) => {
  const res = await request.delete(`/outbounds/${id}`);
  return res.data;
};