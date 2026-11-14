import { createTheme } from '@mui/material/styles';

// One primary colour, one radius, one font stack. Spacing uses MUI's 8px scale everywhere.
const theme = createTheme({
  palette: {
    primary: { main: '#1e5eff' },
    background: { default: '#f6f7fb' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 700 },
    h2: { fontSize: '1.375rem', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiTextField: { defaultProps: { fullWidth: true } },
  },
});

export default theme;
