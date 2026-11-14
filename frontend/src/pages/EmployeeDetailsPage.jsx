import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Link, Paper, Skeleton, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmployeeAvatar from '../components/EmployeeAvatar';
import ConfirmDialog from '../components/ConfirmDialog';
import NotFoundPanel from '../components/NotFoundPanel';
import QueryError from '../components/QueryError';
import { getEmployee } from '../api/employees';
import { isNotFound } from '../api/errors';
import { useDeleteEmployee } from '../hooks/useEmployeeMutations';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate, formatSalary, fullName } from '../utils/format';

function Field({ label, children }) {
  return (
    <Box>
      <Typography component="dt" variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography component="dd" sx={{ m: 0, fontWeight: 500, wordBreak: 'break-word' }}>
        {children || '—'}
      </Typography>
    </Box>
  );
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ['employee', id], queryFn: () => getEmployee(id) });
  usePageTitle(query.data ? fullName(query.data) : 'Employee');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const del = useDeleteEmployee({ onSuccess: () => navigate('/employees', { replace: true }) });

  if (query.isPending) return <Skeleton variant="rounded" height={320} />;
  if (query.isError) {
    // Another user's id -> backend 404 -> this panel. Not a crash, not a leak.
    return isNotFound(query.error) ? <NotFoundPanel /> : <QueryError error={query.error} onRetry={query.refetch} />;
  }

  const emp = query.data;
  const name = fullName(emp);

  return (
    <>
      <Button component={RouterLink} to="/employees" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        All employees
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <EmployeeAvatar employee={emp} size={120} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h1">{name}</Typography>
            <Typography color="text.secondary">
              {emp.position} · {emp.department}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<EditIcon />} component={RouterLink} to={`/employees/${id}/edit`}>
              Edit
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </Stack>
        </Stack>

        <Box
          component="dl"
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 4, mb: 0 }}
        >
          <Field label="Email">
            {emp.email && <Link href={`mailto:${emp.email}`}>{emp.email}</Link>}
          </Field>
          <Field label="Position">{emp.position}</Field>
          <Field label="Department">{emp.department}</Field>
          <Field label="Salary">{formatSalary(emp.salary)}</Field>
          <Field label="Date of joining">{formatDate(emp.date_of_joining)}</Field>
          {emp.updatedAt && <Field label="Last updated">{formatDate(emp.updatedAt)}</Field>}
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${name}?`}
        message="This cannot be undone."
        pending={del.isPending}
        onConfirm={() => del.mutate(emp)}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
