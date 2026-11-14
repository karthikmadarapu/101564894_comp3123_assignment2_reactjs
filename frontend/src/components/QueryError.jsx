import { Alert, Button } from '@mui/material';
import { getErrorMessage } from '../api/errors';

export default function QueryError({ error, onRetry }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={() => onRetry()}>
            Retry
          </Button>
        )
      }
    >
      {getErrorMessage(error)}
    </Alert>
  );
}
