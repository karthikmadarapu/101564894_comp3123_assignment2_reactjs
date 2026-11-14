import { useQuery } from '@tanstack/react-query';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PageStub from '../components/PageStub';
import { listEmployees } from '../api/employees';
import { getErrorMessage } from '../api/client';

export default function EmployeeList() {
  const { data, isLoading, error } = useQuery({ queryKey: ['employees'], queryFn: listEmployees });
  const employees = Array.isArray(data) ? data : (data?.employees ?? data?.data ?? []);

  return (
    <PageStub title="Employees">
      <Stack spacing={2} sx={{ mt: 2 }} alignItems="flex-start">
        {isLoading && <CircularProgress size={24} />}
        {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}
        {data && <Alert severity="success">API works: {employees.length} employee(s) loaded.</Alert>}
        <Button component={RouterLink} to="/employees/add" variant="contained">
          Add employee
        </Button>
      </Stack>
    </PageStub>
  );
}