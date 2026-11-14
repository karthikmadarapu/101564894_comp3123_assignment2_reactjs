import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './authContext';
import { setUnauthorizedHandler } from '../api/client';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const MAX_TIMEOUT = 2 ** 31 - 1; // setTimeout limit (~24.8 days)

// Milliseconds until the token expires; 0 if missing, malformed or expired.
function msLeft(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp ? Math.max(exp * 1000 - Date.now(), 0) : 0;
  } catch {
    return 0;
  }
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Runs once, before the first render: an expired session never renders as "logged in".
function readSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || msLeft(token) <= 0) {
    clearStorage();
    return { token: null, user: null };
  }
  try {
    return { token, user: JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') };
  } catch {
    return { token, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const login = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
    setSession({ token, user: user ?? null });
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setSession({ token: null, user: null });
    queryClient.clear(); // no stale employee data left in memory
    navigate('/login', { replace: true });
  }, [navigate, queryClient]);

  const expire = useCallback(() => {
    logout();
    enqueueSnackbar('Your session expired. Please log in again.', {
      variant: 'warning',
      preventDuplicate: true,
    });
  }, [logout, enqueueSnackbar]);

  // Any 401 from the API (outside login/signup) ends the session.
  useEffect(() => {
    setUnauthorizedHandler(expire);
    return () => setUnauthorizedHandler(() => {});
  }, [expire]);

  // Auto-logout the moment the JWT expires, even if no request is made.
  useEffect(() => {
    if (!session.token) return undefined;
    const id = setTimeout(expire, Math.min(msLeft(session.token), MAX_TIMEOUT));
    return () => clearTimeout(id);
  }, [session.token, expire]);

  const value = useMemo(
    () => ({ ...session, isAuthenticated: Boolean(session.token), login, logout }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}