import { Component } from 'react';
import { Button, Paper, Typography } from '@mui/material';

// Catches render bugs so the user sees a friendly panel instead of a white screen or a stack trace.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console -- dev-only diagnostics; production shows the panel only
    if (import.meta.env.DEV) console.error(error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This page hit an unexpected problem. Your data is safe.
        </Typography>
        <Button variant="contained" onClick={() => window.location.assign('/employees')}>
          Back to employees
        </Button>
      </Paper>
    );
  }
}
