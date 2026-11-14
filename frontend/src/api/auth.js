import api from './client';

// ⚠️ Match your A1 contract. If your routes differ (e.g. /auth/login), change only these two paths
// AND the AUTH_PATHS list in client.js.

// One "Username or email" field: an @ means email, otherwise username.
export function loginRequest(identifier, password) {
  const id = identifier.trim();
  const body = id.includes('@') ? { email: id, password } : { username: id, password };
  return api.post('/user/login', body).then((r) => r.data);
}

export function signupRequest({ username, email, password }) {
  return api
    .post('/user/signup', { username: username.trim(), email: email.trim(), password })
    .then((r) => r.data);
}

// Different backends name the token differently; accept the common ones.
export const extractToken = (data) => data?.token ?? data?.jwt_token ?? data?.accessToken ?? null;
