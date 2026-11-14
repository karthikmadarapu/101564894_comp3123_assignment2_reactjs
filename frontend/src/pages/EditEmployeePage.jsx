import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton, Typography } from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';
import NotFoundPanel from '../components/NotFoundPanel';
import QueryError from '../components/QueryError';
import { getEmployee, toFormValues, updateEmployee } from '../api/employees';
import { isNotFound } from '../api/errors';
import { useSnackbar } from '../hooks/useSnackbar';
import { usePageTitle } from '../hooks/usePageTitle';
import { fullName, pictureUrl } from '../utils/format';

export default function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useSnackbar();

  const query = useQuery({ queryKey: ['employee', id], queryFn: () => getEmployee(id) });
  usePageTitle(query.data ? `Edit ${fullName(query.data)}` : 'Edit employee');

  const mutation = useMutation({
    mutationFn: (formData) => updateEmployee(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      notify('Employee updated.');
      navigate(`/employees/${id}`);
    },
  });

  if (query.isPending) return <Skeleton variant="rounded" height={420} />;
  if (query.isError) {
    return isNotFound(query.error) ? <NotFoundPanel /> : <QueryError error={query.error} onRetry={query.refetch} />;
  }

  const emp = query.data;
  return (
    <>
      <Typography variant="h1" sx={{ mb: 2 }}>
        Edit {fullName(emp)}
      </Typography>
      {/* key: re-initialise the form if the id changes */}
      <EmployeeForm
        key={id}
        initialValues={toFormValues(emp)}
        currentPictureUrl={pictureUrl(emp.profile_picture)}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        isPending={mutation.isPending}
        submitError={mutation.error}
        onSubmit={(fd) => mutation.mutate(fd)}
        onCancel={() => navigate(`/employees/${id}`)}
      />
    </>
  );
}
