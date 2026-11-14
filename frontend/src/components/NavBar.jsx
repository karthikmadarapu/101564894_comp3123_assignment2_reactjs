import { useState } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const links = isAuthenticated
    ? [
        { to: '/employees', label: 'Employees' },
        { to: '/employees/add', label: 'Add Employee' },
      ]
    : [
        { to: '/login', label: 'Log in' },
        { to: '/signup', label: 'Sign up' },
      ];
  const username = user?.username ?? user?.email ?? 'Account';
  const closeMenu = () => setAnchorEl(null);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to={isAuthenticated ? '/employees' : '/login'}
          sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700, flexGrow: 1 }}
        >
          EMS
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="Open navigation menu"
              aria-controls={anchorEl ? 'nav-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu id="nav-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
              {isAuthenticated && <MenuItem disabled>Signed in as {username}</MenuItem>}
              {links.map((l) => (
                <MenuItem key={l.to} component={RouterLink} to={l.to} onClick={closeMenu}>
                  {l.label}
                </MenuItem>
              ))}
              {isAuthenticated && (
                <MenuItem
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  Log out
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {links.map((l) => (
              <Button
                key={l.to}
                color="inherit"
                component={NavLink}
                to={l.to}
                end
                sx={{ '&.active': { bgcolor: 'rgba(255,255,255,0.18)' } }}
              >
                {l.label}
              </Button>
            ))}
            {isAuthenticated && (
              <>
                <Typography variant="body2" sx={{ mx: 1, opacity: 0.9 }}>
                  {username}
                </Typography>
                <Button color="inherit" variant="outlined" startIcon={<LogoutIcon />} onClick={logout}>
                  Log out
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
