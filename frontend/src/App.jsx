import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { login as loginApi } from './api/auth';
import { getErrorMessage } from './api/client';

export default function App() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [keys, setKeys] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginApi(form);
      setKeys(Object.keys(data).join(', ')); // shows the response shape, never the token itself
      const token = data.token ?? data.jwt_token ?? data.accessToken;
      if (!token) throw new Error('No token in login response. Check the backend.');
      login(token, data.user ?? { username: data.username, email: data.email ?? form.email });
    } catch (err) {
      setError(err.response ? getErrorMessage(err) : err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8, px: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Step 3 checkpoint
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Status: <b>{isAuthenticated ? `logged in as ${user?.username ?? user?.email ?? '?'}` : 'logged out'}</b>
        </Typography>
        {keys && <Alert severity="info" sx={{ mb: 2 }}>Login response keys: {keys}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isAuthenticated ? (
          <Button variant="outlined" onClick={logout}>
            Log out
          </Button>
        ) : (
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button type="submit" variant="contained">
              Test login
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}