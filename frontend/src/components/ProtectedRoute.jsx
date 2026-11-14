import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// UX guard only — the server checks every request independently.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // replace: after logout, Back can't return to a protected page
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// Logged-in users visiting /login or /signup go straight to the list.
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/employees" replace />;
  return <Outlet />;
}
