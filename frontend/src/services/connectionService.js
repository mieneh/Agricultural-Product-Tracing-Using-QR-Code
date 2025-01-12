import request from '../utils/request';

export const getConnectionsWithProducer = async () => {
  const response = await request.get('/connections/transporter');
  return response.data;
};

export const getConnectionsWithTransporter = async () => {
  const response = await request.get('/connections/producer');
  return response.data;
};

export const createConnectionWithProducer = async (data) => {
  const response = await request.post('/connections/send-transporter', data);
  return response.data;
};

export const createConnectionWithTransporter = async (data) => {
  const response = await request.post('/connections/send-producer', data);
  return response.data;
};

export const updateConnectionStatus = async (id, data) => {
  const response = await request.put(`/connections/accept-reject/${id}`, data);
  return response.data;
};

export const cancelConnectionRequest = async (id) => {
  const response = await request.delete(`/connections/cancel/${id}`);
  return response.data;
};
