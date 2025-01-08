import request from '../utils/request';

export const getInbounds = async () => {
  const res = await request.get('/inbounds');
  return res.data;
};

export const createInbound = async (data) => {
  const res = await request.post('/inbounds', data);
  return res.data;
};

export const updateInbound = async (id, data) => {
  const res = await request.put(`/inbounds/${id}`, data);
  return res.data;
};

export const deleteInbound = async (id) => {
  const res = await request.delete(`/inbounds/${id}`);
  return res.data;
};