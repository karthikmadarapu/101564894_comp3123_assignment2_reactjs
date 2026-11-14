import { Avatar } from '@mui/material';
import { fullName, initials, pictureUrl } from '../utils/format';

// MUI Avatar falls back to its children (the initials) when there is no src
// or when the image fails to load — that is the placeholder.
export default function EmployeeAvatar({ employee, size = 40, src }) {
  const url = src ?? pictureUrl(employee?.profile_picture);
  return (
    <Avatar
      src={url || undefined}
      alt={fullName(employee)}
      sx={{ width: size, height: size, bgcolor: 'primary.main', fontSize: size * 0.4, fontWeight: 600 }}
    >
      {initials(employee)}
    </Avatar>
  );
}
