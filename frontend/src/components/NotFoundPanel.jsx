import { Link as RouterLink } from 'react-router-dom';
import { Button, Paper, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

// Shown for another user's id, a deleted id, a malformed id, or an unknown URL.
export default function NotFoundPanel({
  title = 'Employee not found',
  message = "This employee doesn't exist or you don't have access to it.",
  to = '/employees',
  linkLabel = 'Back to employees',
}) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
      <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} aria-hidden="true" />
      <Typography variant="h2" component="h1" sx={{ my: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      <Button component={RouterLink} to={to} variant="contained">
        {linkLabel}
      </Button>
    </Paper>
  );
}
