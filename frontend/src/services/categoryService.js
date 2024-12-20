import request from '../utils/request';

export const getCategories = async () => {
  const res = await request.get('/categories');
  return res.data;
};

export const createCategory = async (data) => {
  const res = await request.post('/categories', data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await request.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await request.delete(`/categories/${id}`);
  return res.data;
};