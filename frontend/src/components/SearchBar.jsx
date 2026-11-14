import { useEffect, useRef, useState } from 'react';
import { Box, Button, Chip, InputAdornment, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Inputs are local state; after 400 ms of no typing they are trimmed and pushed to the URL
 * (via onFiltersChange). The URL is the source of truth, so refresh and Back keep the search.
 */
export default function SearchBar({ filters, onFiltersChange, resultCount, isFetching }) {
  const [department, setDepartment] = useState(filters.department);
  const [position, setPosition] = useState(filters.position);
  const debouncedDepartment = useDebounce(department, 400);
  const debouncedPosition = useDebounce(position, 400);

  const onChangeRef = useRef(onFiltersChange);
  useEffect(() => {
    onChangeRef.current = onFiltersChange;
  });

  // Push debounced, trimmed values up (whitespace-only becomes '' and is ignored).
  useEffect(() => {
    onChangeRef.current({ department: debouncedDepartment.trim(), position: debouncedPosition.trim() });
  }, [debouncedDepartment, debouncedPosition]);

  // Pull from the URL when it changes elsewhere (chip removed, Back button) without eating a
  // trailing space the user is still typing. Done during render (React's "adjust state when a
  // prop changes" pattern) instead of in an effect, so there is no extra render pass.
  const [seenFilters, setSeenFilters] = useState(filters);
  if (seenFilters.department !== filters.department || seenFilters.position !== filters.position) {
    setSeenFilters(filters);
    if (department.trim() !== filters.department) setDepartment(filters.department);
    if (position.trim() !== filters.position) setPosition(filters.position);
  }

  const hasActive = Boolean(filters.department || filters.position);
  const clear = () => {
    setDepartment('');
    setPosition('');
    onFiltersChange({ department: '', position: '' });
  };

  const searchAdornment = {
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" />
        </InputAdornment>
      ),
    },
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, position: 'relative', overflow: 'hidden' }} role="search">
      {isFetching && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} aria-hidden="true" />}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <TextField
          id="search-department"
          label="Department"
          placeholder="e.g. Engineering"
          size="small"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          slotProps={searchAdornment}
        />
        <TextField
          id="search-position"
          label="Position"
          placeholder="e.g. Developer"
          size="small"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          slotProps={searchAdornment}
        />
        <Button onClick={clear} disabled={!hasActive && !department && !position} sx={{ flexShrink: 0 }}>
          Clear
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 1.5 }} aria-live="polite">
        <Typography variant="body2" color="text.secondary">
          {hasActive
            ? `${resultCount} result${resultCount === 1 ? '' : 's'}`
            : `${resultCount} employee${resultCount === 1 ? '' : 's'}`}
        </Typography>
        {filters.department && (
          <Chip
            size="small"
            label={`Department: ${filters.department}`}
            onDelete={() => onFiltersChange({ ...filters, department: '' })}
          />
        )}
        {filters.position && (
          <Chip
            size="small"
            label={`Position: ${filters.position}`}
            onDelete={() => onFiltersChange({ ...filters, position: '' })}
          />
        )}
      </Box>
    </Paper>
  );
}
