const ORIGIN = new URL(import.meta.env.VITE_API_URL).origin;
const PLACEHOLDER = '/placeholder-avatar.svg';

// Backend stores paths like "/uploads/abc.jpg"; turn them into a full URL.
export const imageUrl = (path) => {
  if (!path) return PLACEHOLDER;
  if (/^https?:\/\//i.test(path)) return path; // already absolute (e.g. Cloudinary)
  return ORIGIN + (path.startsWith('/') ? path : `/${path}`);
};

export { PLACEHOLDER as placeholderAvatar };
