import { api } from './client';

const BASE = '/emp/employees';

// Drop empty filters so the backend doesn't receive department=""
const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
    )
  );

export const listEmployees = () => api.get(BASE).then((res) => res.data);

export const searchEmployees = ({ department, position } = {}) =>
  api
    .get(`${BASE}/search`, { params: cleanParams({ department, position }) })
    .then((res) => res.data);

export const getEmployee = (id) => api.get(`${BASE}/${id}`).then((res) => res.data);

// formData: FormData with fields + optional image file.
// Do NOT set Content-Type; Axios adds multipart/form-data with the boundary itself.
export const createEmployee = (formData) => api.post(BASE, formData).then((res) => res.data);

export const updateEmployee = (id, formData) =>
  api.put(`${BASE}/${id}`, formData).then((res) => res.data);

export const deleteEmployee = (id) =>
  api.delete(BASE, { params: { eid: id } }).then((res) => res.data);
