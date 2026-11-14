import api from './client';
import { toDateInput } from '../utils/format';

// ⚠️ All employee endpoints live here. If your A1 backend differs, change only this file.
const BASE = '/emp/employees';

// Accept either a bare array or { employees: [...] } / { data: [...] }.
const unwrapList = (d) => (Array.isArray(d) ? d : d?.employees ?? d?.data ?? []);
const unwrapOne = (d) => d?.employee ?? d?.data ?? d;

export const listEmployees = () => api.get(BASE).then((r) => unwrapList(r.data));

// Server-side search only. Empty values are never sent (the backend 400s on "no params").
export function searchEmployees(filters) {
  const params = {};
  if (filters.department) params.department = filters.department;
  if (filters.position) params.position = filters.position;
  return api.get(`${BASE}/search`, { params }).then((r) => unwrapList(r.data));
}

export const getEmployee = (id) => api.get(`${BASE}/${id}`).then((r) => unwrapOne(r.data));

// Axios sets the multipart boundary itself when the body is FormData — don't set Content-Type.
export const createEmployee = (formData) => api.post(BASE, formData).then((r) => r.data);
export const updateEmployee = (id, formData) => api.put(`${BASE}/${id}`, formData).then((r) => r.data);

// A1 contract: DELETE /emp/employees?eid=<id> -> 204
export const deleteEmployee = (id) => api.delete(BASE, { params: { eid: id } });

export const EMPLOYEE_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'position',
  'department',
  'salary',
  'date_of_joining',
];

// Text fields first, file last (some validators read fields before Multer finishes the file).
export function toEmployeeFormData(values, file) {
  const fd = new FormData();
  EMPLOYEE_FIELDS.forEach((key) => {
    const v = values[key];
    fd.append(key, typeof v === 'string' ? v.trim() : v ?? '');
  });
  if (file) fd.append('profile_picture', file);
  return fd;
}

// API object -> form values (date input needs YYYY-MM-DD, number input needs a string).
export function toFormValues(emp) {
  return {
    first_name: emp?.first_name ?? '',
    last_name: emp?.last_name ?? '',
    email: emp?.email ?? '',
    position: emp?.position ?? '',
    department: emp?.department ?? '',
    salary: emp?.salary != null ? String(emp.salary) : '',
    date_of_joining: toDateInput(emp?.date_of_joining),
  };
}
