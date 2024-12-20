import request from '../utils/request';

export const getUsers = async () => {
  const response = await request.get(`/users`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await request.post(`/users`, data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await request.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await request.delete(`/users/${id}`);
  return response.data;
};

export const resetPassword = async (fullname) => {
  const response = await request.post(`/users/reset-password`, { fullname });
  return response.data;
};

export const getAllTransports = async () => {
  const response = await request.get('/users/transporter');
  return response.data;
};

export const getAllProducers = async () => {
  const response = await request.get('/users/producer');
  return response.data;
};