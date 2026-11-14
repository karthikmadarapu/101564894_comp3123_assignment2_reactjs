import { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Button, Paper, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import SearchBar from '../components/SearchBar';
import EmployeeTable from '../components/EmployeeTable';
import ConfirmDialog from '../components/ConfirmDialog';
import QueryError from '../components/QueryError';
import { listEmployees, searchEmployees } from '../api/employees';
import { useDeleteEmployee } from '../hooks/useEmployeeMutations';
import { usePageTitle } from '../hooks/usePageTitle';
import { fullName } from '../utils/format';

function EmptyState({ icon, title, action }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 6 }, textAlign: 'center' }}>
      {icon}
      <Typography variant="h2" sx={{ my: 1 }}>
        {title}
      </Typography>
      {action}
    </Paper>
  );
}

function describeFilters({ department, position }) {
  const parts = [];
  if (department) parts.push(`department ‘${department}’`);
  if (position) parts.push(`position ‘${position}’`);
  return parts.join(' and ');
}

export default function EmployeeListPage() {
  usePageTitle('Employees');
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL (/employees?department=eng) is the single source of truth for filters.
  const filters = useMemo(
    () => ({
      department: (searchParams.get('department') ?? '').trim(),
      position: (searchParams.get('position') ?? '').trim(),
    }),
    [searchParams],
  );
  const hasFilters = Boolean(filters.department || filters.position);

  const applyFilters = useCallback(
    (next) => {
      if (next.department === filters.department && next.position === filters.position) return;
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          ['department', 'position'].forEach((k) => (next[k] ? p.set(k, next[k]) : p.delete(k)));
          return p;
        },
        { replace: true },
      );
    },
    [filters, setSearchParams],
  );

  // One query. With filters -> GET /emp/employees/search (server-side, never Array.filter).
  const query = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => (hasFilters ? searchEmployees(filters) : listEmployees()),
    placeholderData: keepPreviousData, // old rows stay visible while the new search loads
  });
  const employees = query.data ?? [];

  const [toDelete, setToDelete] = useState(null);
  const del = useDeleteEmployee({ onSuccess: () => setToDelete(null) });

  let content;
  if (query.isError) {
    content = <QueryError error={query.error} onRetry={query.refetch} />;
  } else if (query.isPending) {
    content = <EmployeeTable loading />;
  } else if (employees.length === 0 && hasFilters) {
    content = (
      <EmptyState
        icon={<SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} aria-hidden="true" />}
        title={`No employees match ${describeFilters(filters)}`}
        action={<Button onClick={() => applyFilters({ department: '', position: '' })}>Clear search</Button>}
      />
    );
  } else if (employees.length === 0) {
    content = (
      <EmptyState
        icon={<PeopleOutlineIcon sx={{ fontSize: 48, color: 'text.secondary' }} aria-hidden="true" />}
        title="No employees yet"
        action={
          <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/employees/add">
            Add your first employee
          </Button>
        }
      />
    );
  } else {
    content = <EmployeeTable employees={employees} onDelete={setToDelete} />;
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 2 }}>
        <Typography variant="h1">Employees</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/employees/add">
          Add employee
        </Button>
      </Stack>

      <SearchBar
        filters={filters}
        onFiltersChange={applyFilters}
        resultCount={employees.length}
        isFetching={query.isFetching && !query.isPending}
      />

      {content}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={toDelete ? `Delete ${fullName(toDelete)}?` : ''}
        message="This cannot be undone."
        pending={del.isPending}
        onConfirm={() => del.mutate(toDelete)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
