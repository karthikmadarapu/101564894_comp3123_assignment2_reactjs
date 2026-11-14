import { API_ORIGIN } from '../api/client';

const currency = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
// timeZone UTC: dates are stored as midnight UTC; formatting in Toronto time would show the day before.
const dateFmt = new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeZone: 'UTC' });

export function formatSalary(v) {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—';
  return currency.format(Number(v));
}

export function formatDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d);
}

// "2024-03-05T00:00:00.000Z" -> "2024-03-05" for <input type="date">
export const toDateInput = (v) => (v ? String(v).slice(0, 10) : '');

export const fullName = (e) => [e?.first_name, e?.last_name].filter(Boolean).join(' ') || 'Employee';

export const initials = (e) => `${e?.first_name?.[0] ?? ''}${e?.last_name?.[0] ?? ''}`.toUpperCase() || '?';

// Mongo _id, or whatever your A1 returns.
export const getId = (e) => e?._id ?? e?.employee_id ?? e?.id;

// Backend stores "/uploads/<uuid>.jpg"; the browser needs the full API origin in front of it.
export function pictureUrl(path) {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
