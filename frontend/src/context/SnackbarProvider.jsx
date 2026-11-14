import { useCallback, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { SnackbarContext } from './snackbarContext';

// One global toast. MUI Snackbar + Alert are announced by screen readers.
export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState({ message: '', severity: 'success', key: 0 });

  const notify = useCallback((message, severity = 'success') => {
    setSnack({ message, severity, key: Date.now() });
    setOpen(true);
  }, []);

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        key={snack.key}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
