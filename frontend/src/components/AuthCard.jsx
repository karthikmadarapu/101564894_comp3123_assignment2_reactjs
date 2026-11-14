import { Paper, Typography } from '@mui/material';

export default function AuthCard({ title, subtitle, children }) {
  return (
    <Paper variant="outlined" sx={{ maxWidth: 440, mx: 'auto', mt: { xs: 2, sm: 6 }, p: { xs: 3, sm: 4 } }}>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Paper>
  );
}
