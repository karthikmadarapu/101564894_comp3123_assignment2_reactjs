import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { setUnauthorizedHandler, TOKEN_KEY } from '../api/client';
import { AuthContext } from './authContext';
import { useSnackbar } from '../hooks/useSnackbar';
import { getTokenExpiry } from '../utils/jwt';

const USER_KEY = 'user';

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Runs once before the first render: an expired token never renders as "logged in".
function readSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const exp = getTokenExpiry(token);
  if (exp && exp <= Date.now()) {
    clearStorage();
    return null;
  }
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    /* ignore bad JSON */
  }
  return { token, user };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useSnackbar();
  const endingRef = useRef(false); // several 401s can arrive at once; end the session only once

  const endSession = useCallback(
    (reason) => {
      if (endingRef.current) return;
      endingRef.current = true;
      clearStorage();
      queryClient.clear(); // the next user must never see the previous user's cached employees
      setSession(null);
      if (reason === 'expired') notify('Your session expired. Please log in again.', 'warning');
      else notify('You have been logged out.', 'info');
      navigate('/login', { replace: true });
    },
    [navigate, notify, queryClient],
  );

  const login = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
    endingRef.current = false;
    setSession({ token, user });
  }, []);

  const logout = useCallback(() => endSession('logout'), [endSession]);

  // 1) Reactive: the Axios response interceptor calls this on any 401 from a protected call.
  useEffect(() => {
    setUnauthorizedHandler(() => endSession('expired'));
    return () => setUnauthorizedHandler(null);
  }, [endSession]);

  // 2) Proactive: log out exactly when the JWT expires, without waiting for the next request.
  useEffect(() => {
    if (!session?.token) return undefined;
    const exp = getTokenExpiry(session.token);
    if (!exp) return undefined;
    const timer = setTimeout(() => endSession('expired'), Math.max(exp - Date.now(), 0));
    return () => clearTimeout(timer);
  }, [session, endSession]);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
