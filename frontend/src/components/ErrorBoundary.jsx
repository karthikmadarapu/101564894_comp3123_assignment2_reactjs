import { Component } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

// Catches render errors anywhere below it, so users never see a white screen or stack trace.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    // Sits outside the router, so use a full reload instead of navigate().
    window.location.assign('/employees');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
        <Paper elevation={0} sx={{ p: 4, maxWidth: 420, textAlign: 'center', border: 1, borderColor: 'divider' }}>
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            An unexpected error occurred. Reloading usually fixes it.
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            Back to employees
          </Button>
        </Paper>
      </Box>
    );
  }
}