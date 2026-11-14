import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployee } from '../api/employees';
import { getErrorMessage } from '../api/errors';
import { fullName, getId } from '../utils/format';
import { useSnackbar } from '../hooks/useSnackbar';

// Used by both the list page and the details page.
export function useDeleteEmployee({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const { notify } = useSnackbar();
  return useMutation({
    mutationFn: (emp) => deleteEmployee(getId(emp)),
    onSuccess: (_data, emp) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.removeQueries({ queryKey: ['employee', String(getId(emp))] });
      notify(`${fullName(emp)} was deleted.`);
      onSuccess?.(emp);
    },
    onError: (err) => notify(getErrorMessage(err, 'Could not delete the employee.'), 'error'),
  });
}
