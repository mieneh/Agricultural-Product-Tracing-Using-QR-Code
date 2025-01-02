import request from '../utils/request';

export const getVehicles = async () => {
  const res = await request.get('/vehicles');
  return res.data;
};

export const createVehicle = async (data) => {
  const res = await request.post('/vehicles', data);
  return res.data;
};

export const updateVehicle = async (id, data) => {
  const res = await request.put(`/vehicles/${id}`, data);
  return res.data;
};

export const deleteVehicle = async (id) => {
  const res = await request.delete(`/vehicles/${id}`);
  return res.data;
};