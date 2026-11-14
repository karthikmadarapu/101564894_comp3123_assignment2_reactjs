import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Divider, Paper, Stack, TextField } from '@mui/material';
import AvatarUpload from './AvatarUpload';
import { useForm } from '../hooks/useForm';
import { validateEmployee } from '../utils/validators';
import { getErrorMessage, getFieldErrors } from '../api/errors';
import { toEmployeeFormData } from '../api/employees';

const EMPTY = {
  first_name: '',
  last_name: '',
  email: '',
  position: '',
  department: '',
  salary: '',
  date_of_joining: '',
};

// Order here = visual order = focus order for the first invalid field.
const FIELDS = [
  { name: 'first_name', label: 'First name', autoComplete: 'given-name' },
  { name: 'last_name', label: 'Last name', autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'position', label: 'Position' },
  { name: 'department', label: 'Department' },
  { name: 'salary', label: 'Salary (CAD)', type: 'number', htmlInput: { min: 0, step: '0.01' } },
  { name: 'date_of_joining', label: 'Date of joining', type: 'date', shrink: true },
];

const FILE_ERROR_CODES = ['INVALID_FILE_TYPE', 'FILE_TOO_LARGE'];

/** One form for Add and Edit. Calls onSubmit(formData). */
export default function EmployeeForm({
  initialValues,
  currentPictureUrl,
  submitLabel = 'Save',
  pendingLabel = 'Saving…',
  isPending,
  submitError,
  onSubmit,
  onCancel,
}) {
  const { values, errors, register, validateAll, setServerErrors } = useForm(
    { ...EMPTY, ...initialValues },
    validateEmployee,
  );
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  // Map server errors: errors[] -> under each field; file errors -> under the picker.
  // This reacts to a prop set by the parent's mutation, and it must also move focus, so it
  // belongs in an effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!submitError) return;
    const { profile_picture: pictureError, ...fieldErrors } = getFieldErrors(submitError);
    const code = submitError?.response?.data?.code;
    if (pictureError) setFileError(pictureError);
    else if (FILE_ERROR_CODES.includes(code)) setFileError(getErrorMessage(submitError));
    setServerErrors(fieldErrors);
  }, [submitError, setServerErrors]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    onSubmit(toEmployeeFormData(values, file));
  };

  const previewEmployee = { first_name: values.first_name, last_name: values.last_name };

  return (
    <Paper variant="outlined" component="form" noValidate onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 4 } }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage(submitError, 'Please fix the highlighted fields.')}
        </Alert>
      )}

      <AvatarUpload
        employee={previewEmployee}
        currentUrl={currentPictureUrl}
        file={file}
        onFileChange={(f) => {
          setFile(f);
          setFileError('');
        }}
        error={fileError}
      />

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {FIELDS.map((f) => (
          <TextField
            key={f.name}
            {...register(f.name)}
            label={f.label}
            type={f.type ?? 'text'}
            required
            autoComplete={f.autoComplete}
            helperText={errors[f.name] || ' '}
            slotProps={{
              htmlInput: f.htmlInput,
              inputLabel: f.shrink ? { shrink: true } : undefined,
            }}
          />
        ))}
      </Box>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
