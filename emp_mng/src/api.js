import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (employee) => api.post('/employees', employee),
  update: (id, employee) => api.put(`/employees/${id}`, employee),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
};
