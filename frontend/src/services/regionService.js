import request from '../utils/request';

export const getRegions = async () => {
  const res = await request.get(`/regions`);
  return res.data;
};

export const createRegion = async (data) => {
  const res = await request.post(`/regions`, data);
  return res.data;
};

export const updateRegion = async (id, data) => {
  const res = await request.put(`/regions/${id}`, data);
  return res.data;
};

export const deleteRegion = async (id) => {
  const res = await request.delete(`/regions/${id}`);
  return res.data;
};