import { useContext } from 'react';
import { SnackbarContext } from '../context/snackbarContext';

// notify('Employee added')             -> green
// notify('Session expired', 'warning') -> orange
export const useSnackbar = () => useContext(SnackbarContext);
