import request from '../utils/request';

export const getDrivers = async () => {
  const res = await request.get('/drivers');
  return res.data;
};

export const createDriver = async (data) => {
  const res = await request.post('/drivers', data);
  return res.data;
};

export const updateDriver = async (id, data) => {
  const res = await request.put(`/drivers/${id}`, data);
  return res.data;
};

export const deleteDriver = async (id) => {
  const res = await request.delete(`/drivers/${id}`);
  return res.data;
};