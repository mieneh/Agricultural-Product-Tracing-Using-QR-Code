import request from '../utils/request';

export const getAllRequests = async () => {
  const res = await request.get('/requests');
  return res.data;
};

export const getRequestById = async (id) => {
  const res = await request.get(`/requests/${id}`);
  return res.data;
};

export const sendRequest = async (data) => {
  const res = await request.post('/requests/send', data);
  return res.data;
};

export const updateRequestStatus = async (id, data) => {
  const res = await request.put(`/requests/${id}`, data);
  return res.data;
};

export const acceptRequest = async (id) => {
  const res = await request.put(`/requests/accept/${id}`);
  return res.data;
};

export const rejectRequest = async (id, message = 'Bị từ chối') => {
  const res = await request.put(`/requests/${id}`, { status: 'Rejected', message });
  return res.data;
};

export const cancelRequest = async (id, message = 'Bị hủy') => {
  const res = await request.put(`/requests/${id}`, { status: 'Rejected', message });
  return res.data;
};

export const assignTransporter = async (data) => {
  const res = await request.post('/requests/assign-transporter', data);
  return res.data;
};
