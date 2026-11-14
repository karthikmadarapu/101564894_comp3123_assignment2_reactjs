// Reads `exp` from the JWT payload (no verification; the server does that on every request).
export function getTokenExpiry(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(part));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
