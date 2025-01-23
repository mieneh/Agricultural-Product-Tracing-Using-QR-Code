import request from "../utils/request";

export const getNotifications = async () => {
  const res = await request.get("/notifications");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await request.delete(`/notifications/${id}`);
  return res.data;
};

export const deleteAllNotifications = async () => {
  const res = await request.delete("/notifications/clear-all");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await request.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await request.patch("/notifications/mark-all-read");
  return res.data;
};