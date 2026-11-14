import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Alert, Box, Button, CircularProgress, Link, TextField, Typography } from '@mui/material';
import AuthCard from '../components/AuthCard';
import { useSnackbar } from '../hooks/useSnackbar';
import { useForm } from '../hooks/useForm';
import { usePageTitle } from '../hooks/usePageTitle';
import { PASSWORD_RULE, USERNAME_RULE, validateSignup } from '../utils/validators';
import { signupRequest } from '../api/auth';
import { getAuthErrorMessage, getFieldErrors } from '../api/errors';

// Decision (document it in the README): after signup we redirect to /login with a toast
// and the username pre-filled, instead of auto-login.
export default function SignupPage() {
  usePageTitle('Sign up');
  const { notify } = useSnackbar();
  const navigate = useNavigate();
  const { values, errors, register, validateAll, setServerErrors } = useForm(
    { username: '', email: '', password: '', confirmPassword: '' },
    validateSignup,
  );
  const [alert, setAlert] = useState('');

  const mutation = useMutation({
    mutationFn: () => signupRequest(values),
    onSuccess: () => {
      notify('Account created. Please log in.');
      navigate('/login', { replace: true, state: { username: values.username.trim() } });
    },
    onError: (err) => {
      setAlert(getAuthErrorMessage(err, 'signup'));
      setServerErrors(getFieldErrors(err));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert('');
    if (!validateAll()) return;
    mutation.mutate();
  };

  return (
    <AuthCard title="Create an account" subtitle="Each account only ever sees its own employees.">
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1 }}>
        {alert && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {alert}
          </Alert>
        )}
        <TextField
          {...register('username')}
          label="Username"
          required
          autoComplete="username"
          autoFocus
          helperText={errors.username || USERNAME_RULE}
        />
        <TextField
          {...register('email')}
          label="Email"
          type="email"
          required
          autoComplete="email"
          helperText={errors.email || ' '}
        />
        {/* The rule is visible before the user types, not only after an error. */}
        <TextField
          {...register('password')}
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          helperText={errors.password || PASSWORD_RULE}
        />
        <TextField
          {...register('confirmPassword')}
          label="Confirm password"
          type="password"
          required
          autoComplete="new-password"
          helperText={errors.confirmPassword || ' '}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={mutation.isPending}
          startIcon={mutation.isPending ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {mutation.isPending ? 'Creating account…' : 'Sign up'}
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">
            Log in
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}
