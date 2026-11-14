// Pull token + non-sensitive user info out of the login response.
export function parseAuthResponse(data, fallbackEmail = '') {
  const token = data?.token ?? data?.jwt_token ?? data?.accessToken ?? data?.data?.token;
  if (!token) throw new Error('Login succeeded but no token was returned. Check the backend response.');
  const u = data?.user ?? data?.data?.user ?? data ?? {};
  return { token, user: { username: u.username ?? '', email: u.email ?? fallbackEmail } };
}