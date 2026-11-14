import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Link,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmployeeAvatar from './EmployeeAvatar';
import { formatDate, formatSalary, fullName, getId } from '../utils/format';

/**
 * Desktop: Employee | Department | Joined | Salary | Actions
 * Under 600 px: Employee (name, position · department) | Actions  -> never scrolls sideways.
 */
export default function EmployeeTable({ employees = [], loading = false, onDelete }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const wide = !isMobile;
  const columns = wide ? 5 : 2;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Employees" size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            {wide && (
              <>
                <TableCell>Department</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Salary</TableCell>
              </>
            )}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columns }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : employees.map((emp) => {
                const id = getId(emp);
                const name = fullName(emp);
                return (
                  <TableRow key={id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <EmployeeAvatar employee={emp} size={40} />
                        <Box sx={{ minWidth: 0 }}>
                          <Link component={RouterLink} to={`/employees/${id}`} underline="hover" fontWeight={600}>
                            {name}
                          </Link>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {wide ? emp.position : `${emp.position ?? ''} · ${emp.department ?? ''}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {wide && (
                      <>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{formatDate(emp.date_of_joining)}</TableCell>
                        <TableCell align="right">{formatSalary(emp.salary)}</TableCell>
                      </>
                    )}
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="View">
                        <IconButton component={RouterLink} to={`/employees/${id}`} aria-label={`View ${name}`} size={isMobile ? 'small' : 'medium'}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton component={RouterLink} to={`/employees/${id}/edit`} aria-label={`Edit ${name}`} size={isMobile ? 'small' : 'medium'}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => onDelete?.(emp)} aria-label={`Delete ${name}`} size={isMobile ? 'small' : 'medium'}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
