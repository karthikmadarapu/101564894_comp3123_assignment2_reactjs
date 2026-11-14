import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';
import { createEmployee } from '../api/employees';
import { useSnackbar } from '../hooks/useSnackbar';
import { usePageTitle } from '../hooks/usePageTitle';

export default function AddEmployeePage() {
  usePageTitle('Add employee');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useSnackbar();

  const mutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      notify('Employee added.');
      navigate('/employees');
    },
  });

  return (
    <>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Add employee
      </Typography>
      <EmployeeForm
        submitLabel="Add employee"
        pendingLabel="Adding…"
        isPending={mutation.isPending}
        submitError={mutation.error}
        onSubmit={(fd) => mutation.mutate(fd)}
        onCancel={() => navigate('/employees')}
      />
    </>
  );
}
