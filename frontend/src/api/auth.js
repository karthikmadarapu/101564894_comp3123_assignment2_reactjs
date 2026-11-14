import { api } from './client';

// body: { username, email, password }
export const signup = (body) => api.post('/user/signup', body).then((res) => res.data);

// body: { email, password } (or { username, password }, whichever your A1 backend accepts)
export const login = (body) => api.post('/user/login', body).then((res) => res.data);
