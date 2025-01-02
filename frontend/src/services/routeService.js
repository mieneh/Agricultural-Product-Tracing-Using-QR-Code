import request from '../utils/request';

export const getRoutes = async () => {
  const res = await request.get('/routes');
  return res.data;
};

export const createRoute = async (data) => {
  const res = await request.post('/routes', data);
  return res.data;
};

export const updateRoute = async (id, data) => {
  const res = await request.put(`/routes/${id}`, data);
  return res.data;
};

export const deleteRoute = async (id) => {
  const res = await request.delete(`/routes/${id}`);
  return res.data;
};