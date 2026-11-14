import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// AuthContext registers the real handler (logout + toast) in Step 3.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 on any call except login/signup means the session is invalid or expired.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = /\/user\/(login|signup)$/.test(error.config?.url ?? '');
    if (error.response?.status === 401 && !isAuthCall) onUnauthorized();
    return Promise.reject(error);
  }
);

// One place to turn any Axios error into a message the UI can show.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'ECONNABORTED') return 'The server took too long to respond.';
  if (!error?.response) return 'Cannot reach the server. Is the backend running?';
  const data = error.response.data;
  if (typeof data === 'string' && data) return data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e.msg ?? e.message ?? String(e)).join(', ');
  }
  return fallback;
}
