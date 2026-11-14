import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';
// Origin of the API (http://localhost:5000) — used to build picture URLs from "/uploads/..." paths.
export const API_ORIGIN = new URL(API_URL, window.location.origin).origin;

export const TOKEN_KEY = 'token';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

// Login/signup must never trigger the "session expired" flow: a 401 there just means wrong password.
const AUTH_PATHS = ['/user/login', '/user/signup'];
const isAuthCall = (config) => AUTH_PATHS.some((p) => config?.url?.includes(p));

// AuthContext registers a handler here, so this file doesn't need React or the router.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

// Request interceptor: attach the JWT to every protected call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !isAuthCall(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: a 401 on a protected call = expired/tampered token -> end the session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !isAuthCall(error.config)) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

export default api;
