import { useCallback, useRef, useState } from 'react';

/**
 * Tiny form helper shared by Login, Signup and EmployeeForm.
 * - controlled values
 * - validate a field on blur, everything on submit
 * - on submit (or server errors) focus the first invalid field, in the order of initialValues
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const order = useRef(Object.keys(initialValues));
  const refs = useRef({});

  const focusFirst = useCallback((errs) => {
    const first = order.current.find((k) => errs[k]);
    if (first) refs.current[first]?.focus();
    return first;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((errs) => (errs[name] ? { ...errs, [name]: undefined } : errs));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const message = validate(values)[name];
    setErrors((errs) => ({ ...errs, [name]: message }));
  };

  const validateAll = () => {
    const all = Object.fromEntries(Object.entries(validate(values)).filter(([, m]) => m));
    setErrors(all);
    return !focusFirst(all);
  };

  const setServerErrors = useCallback(
    (fieldErrors) => {
      if (!fieldErrors || !Object.keys(fieldErrors).length) return;
      setErrors((errs) => ({ ...errs, ...fieldErrors }));
      focusFirst(fieldErrors);
    },
    [focusFirst],
  );

  // Spread onto a MUI TextField: <TextField {...register('email')} label="Email" />
  const register = (name) => ({
    name,
    id: name,
    value: values[name] ?? '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: Boolean(errors[name]),
    inputRef: (el) => {
      refs.current[name] = el;
    },
  });

  return { values, setValues, errors, register, validateAll, setServerErrors };
}
