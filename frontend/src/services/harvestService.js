import request from '../utils/request';

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
