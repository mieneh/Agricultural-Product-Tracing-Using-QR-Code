import request from '../utils/request';

export const getProducts = async () => {
  const res = await request.get(`/products`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await request.post(`/products`, data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await request.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await request.delete(`/products/${id}`);
  return res.data;
};

