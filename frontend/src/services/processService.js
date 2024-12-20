import request from '../utils/request';

export const getProcesses = async () => {
  const res = await request.get(`/processes`);
  return res.data;
};

export const createProcess = async (data) => {
  const res = await request.post(`/processes`, data);
  return res.data;
};

export const updateProcess = async (id, data) => {
  const res = await request.put(`/processes/${id}`, data);
  return res.data;
};

export const deleteProcess = async (id) => {
  const res = await request.delete(`/processes/${id}`);
  return res.data;
};