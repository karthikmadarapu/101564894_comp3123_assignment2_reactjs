import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, FormHelperText, Stack } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmployeeAvatar from './EmployeeAvatar';
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '../utils/validators';

/**
 * Hidden file input behind a real (keyboard-reachable) button.
 * Client checks type + size first; the server's 400 is still shown via `error`.
 */
export default function AvatarUpload({ employee, currentUrl, file, onFileChange, error }) {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState('');

  // Object URL for the preview, revoked when the file changes or the component unmounts.
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!selected) return;
    if (!IMAGE_TYPES.includes(selected.type)) {
      setLocalError('Only JPEG, PNG or WebP images are allowed.');
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setLocalError('Image must be 2 MB or smaller.');
      return;
    }
    setLocalError('');
    onFileChange(selected);
  };

  const shown = preview || currentUrl || null;
  const message = localError || error;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
      <EmployeeAvatar employee={employee} src={shown} size={96} />
      <Box>
        <input
          ref={inputRef}
          id="profile_picture"
          name="profile_picture"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleChange}
        />
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            onClick={() => inputRef.current?.click()}
            aria-describedby="profile-picture-help"
          >
            {shown ? 'Replace picture' : 'Choose picture'}
          </Button>
          {file && (
            <Button color="inherit" onClick={() => onFileChange(null)}>
              Undo
            </Button>
          )}
        </Stack>
        <FormHelperText id="profile-picture-help" error={Boolean(message)} role={message ? 'alert' : undefined}>
          {message || (file ? `Selected: ${file.name}` : 'Optional. JPEG, PNG or WebP, up to 2 MB.')}
        </FormHelperText>
      </Box>
    </Stack>
  );
}
