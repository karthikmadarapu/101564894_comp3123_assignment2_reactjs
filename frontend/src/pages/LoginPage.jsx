import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../hooks/useSnackbar';
import { useForm } from '../hooks/useForm';
import { usePageTitle } from '../hooks/usePageTitle';
import { validateLogin } from '../utils/validators';
import { extractToken, loginRequest } from '../api/auth';
import { getAuthErrorMessage, getFieldErrors, getRetryAfterSeconds } from '../api/errors';

export default function LoginPage() {
  usePageTitle('Log in');
  const { login } = useAuth();
  const { notify } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const { values, errors, register, validateAll, setServerErrors } = useForm(
    { identifier: location.state?.username ?? '', password: '' },
    validateLogin,
  );
  const [alert, setAlert] = useState('');
  const [lockedUntil, setLockedUntil] = useState(0);

  // 429: keep the button disabled until Retry-After has passed.
  useEffect(() => {
    if (!lockedUntil) return undefined;
    const t = setTimeout(() => setLockedUntil(0), Math.max(lockedUntil - Date.now(), 0));
    return () => clearTimeout(t);
  }, [lockedUntil]);

  const mutation = useMutation({
    mutationFn: () => loginRequest(values.identifier, values.password),
    onSuccess: (data) => {
      const token = extractToken(data);
      if (!token) {
        setAlert('Login worked but no token came back. Check the login response shape.');
        return;
      }
      login(token, data.user ?? { username: values.identifier.trim() });
      notify('Welcome back!');
      navigate(location.state?.from?.pathname ?? '/employees', { replace: true });
    },
    onError: (err) => {
      setAlert(getAuthErrorMessage(err, 'login'));
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.username || fieldErrors.email) fieldErrors.identifier = fieldErrors.username || fieldErrors.email;
      setServerErrors(fieldErrors);
      if (err?.response?.status === 429) {
        setLockedUntil(Date.now() + (getRetryAfterSeconds(err) || 60) * 1000);
      }
    },
  });

  const locked = lockedUntil > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert('');
    if (!validateAll()) return;
    mutation.mutate();
  };

  return (
    <AuthCard title="Log in" subtitle="Manage your employees.">
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1 }}>
        {alert && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {alert}
          </Alert>
        )}
        <TextField
          {...register('identifier')}
          label="Username or email"
          required
          autoComplete="username"
          autoFocus
          helperText={errors.identifier || ' '}
        />
        <TextField
          {...register('password')}
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          helperText={errors.password || ' '}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={mutation.isPending || locked}
          startIcon={mutation.isPending ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {mutation.isPending ? 'Signing in…' : locked ? 'Please wait…' : 'Log in'}
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          New here?{' '}
          <Link component={RouterLink} to="/signup">
            Create an account
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}
