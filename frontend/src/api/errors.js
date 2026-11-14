// One place that turns any Axios error into a friendly sentence. Nothing raw reaches the screen.

export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err?.response) return "Can't reach the server. Check your connection and retry.";
  const { status, data } = err.response;
  if (status === 429) {
    const s = getRetryAfterSeconds(err);
    return s
      ? `Too many attempts. Try again in ${Math.ceil(s / 60)} minute(s).`
      : 'Too many attempts. Please wait and try again.';
  }
  if (status >= 500) return 'The server had a problem. Please try again shortly.';
  return data?.message || fallback; // backend messages are already user-safe
}

// errors: [{ field, message }] -> { field: message }
export const getFieldErrors = (err) =>
  Object.fromEntries((err?.response?.data?.errors ?? []).filter((e) => e?.field).map((e) => [e.field, e.message]));

// Needs `exposedHeaders: ['Retry-After']` in the backend CORS config, or the browser hides it.
export function getRetryAfterSeconds(err) {
  const s = Number(err?.response?.headers?.['retry-after']);
  return Number.isFinite(s) && s > 0 ? s : 0;
}

export function getAuthErrorMessage(err, mode = 'login') {
  const status = err?.response?.status;
  if (status === 401) return 'Invalid username/email or password';
  if (status === 409) return 'That username or email is already registered';
  return getErrorMessage(err, mode === 'signup' ? 'Sign up failed. Please try again.' : 'Login failed. Please try again.');
}

// Another user's id (404) or a malformed id (400) both mean "not found" to the user.
export const isNotFound = (err) => [400, 404].includes(err?.response?.status);
