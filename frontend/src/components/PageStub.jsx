import { Paper, Typography } from '@mui/material';

export default function PageStub({ title, children }) {
  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">Coming in Phase 3.</Typography>
      {children}
    </Paper>
  );
}