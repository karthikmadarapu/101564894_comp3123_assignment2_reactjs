import { Link as RouterLink, Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';

export default function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/employees"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
          >
            Employee Manager
          </Typography>

          {isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {user?.username || user?.email}
              </Typography>
              <Button variant="outlined" startIcon={<LogoutIcon />} onClick={logout}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to="/login">
                Log in
              </Button>
              <Button component={RouterLink} to="/signup" variant="contained">
                Sign up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}