import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services d'authentification
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
};

// Services des salles
export const roomService = {
  getAll: () => api.get("/rooms"),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post("/rooms", data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  getTypes: () => api.get("/rooms/types"),
  getEquipments: () => api.get("/rooms/equipments"),
  addEquipment: (roomId, data) => api.post(`/rooms/${roomId}/equipments`, data),
  removeEquipment: (roomId, equipmentId) =>
    api.delete(`/rooms/${roomId}/equipments/${equipmentId}`),
};

// Services des réservations
export const reservationService = {
  getAll: () => api.get("/reservations"),
  getMyReservations: () => api.get("/reservations/my"),
  getByRoom: (roomId) => api.get(`/reservations/room/${roomId}`),
  create: (data) => api.post("/reservations", data),
  delete: (id) => api.delete(`/reservations/${id}`),
};

// Services des notifications
export const notificationService = {
  getAll: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread/count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Services des logs d'audit
export const auditService = {
  getAll: (limit = 50, offset = 0) =>
    api.get(`/audit?limit=${limit}&offset=${offset}`),
  getByUser: (userId) => api.get(`/audit/user/${userId}`),
  getByEntity: (type, id) => api.get(`/audit/entity/${type}/${id}`),
  getByAction: (action) => api.get(`/audit/action/${action}`),
  getCount: () => api.get("/audit/count"),
};

// Services des départements
export const departmentService = {
  getAll: () => api.get("/departments"),
};

export default api;
