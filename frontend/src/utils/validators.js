// Client-side rules are for usability only; the backend (express-validator) is the source of truth.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Mirrors backend/src/validators/userValidators.js: password >= 8 chars, username 3-30 chars (trimmed).
export const PASSWORD_RE = /^.{8,}$/;
export const PASSWORD_RULE = 'At least 8 characters.';
export const USERNAME_RE = /^.{3,30}$/;
export const USERNAME_RULE = '3-30 characters.';

const filled = (v) => String(v ?? '').trim() !== '';

export function validateLogin({ identifier, password }) {
  const e = {};
  if (!filled(identifier)) e.identifier = 'Enter your username or email';
  else if (identifier.includes('@') && !EMAIL_RE.test(identifier.trim())) e.identifier = 'Enter a valid email address';
  if (!filled(password)) e.password = 'Enter your password';
  return e;
}

export function validateSignup({ username, email, password, confirmPassword }) {
  const e = {};
  if (!filled(username)) e.username = 'Choose a username';
  else if (!USERNAME_RE.test(username.trim())) e.username = USERNAME_RULE;
  if (!filled(email)) e.email = 'Enter your email';
  else if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address';
  if (!password) e.password = 'Choose a password';
  else if (!PASSWORD_RE.test(password)) e.password = PASSWORD_RULE;
  if (!confirmPassword) e.confirmPassword = 'Confirm your password';
  else if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match';
  return e;
}

export function validateEmployee(v) {
  const e = {};
  if (!filled(v.first_name)) e.first_name = 'Enter a first name';
  else if (v.first_name.trim().length > 50) e.first_name = 'Keep it under 50 characters';
  if (!filled(v.last_name)) e.last_name = 'Enter a last name';
  else if (v.last_name.trim().length > 50) e.last_name = 'Keep it under 50 characters';
  if (!filled(v.email)) e.email = 'Enter an email';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address';
  if (!filled(v.position)) e.position = 'Enter a position';
  if (!filled(v.department)) e.department = 'Enter a department';
  if (!filled(v.salary)) e.salary = 'Enter a salary';
  else if (!Number.isFinite(Number(v.salary)) || Number(v.salary) <= 0) e.salary = 'Salary must be a positive number';
  if (!filled(v.date_of_joining)) e.date_of_joining = 'Pick a joining date';
  else if (Number.isNaN(new Date(v.date_of_joining).getTime())) e.date_of_joining = 'Enter a valid date';
  return e;
}

// Profile picture rules (mirror backend/src/middleware/upload.js and MAX_UPLOAD_MB).
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
