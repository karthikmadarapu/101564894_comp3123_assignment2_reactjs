import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { login as loginApi } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { parseAuthResponse } from '../utils/authResponse';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await loginApi(form);
      const { token, user } = parseAuthResponse(data, form.email);
      login(token, user);
      const from = location.state?.from;
      navigate(from ? `${from.pathname}${from.search ?? ''}` : '/employees', { replace: true });
    } catch (err) {
      setError(err.isAxiosError ? getErrorMessage(err) : err.message);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6 }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Log in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            required
            autoFocus
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !form.email || !form.password}
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
        </Stack>
        <Typography variant="body2" sx={{ mt: 2 }}>
          No account?{' '}
          <Link component={RouterLink} to="/signup">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}