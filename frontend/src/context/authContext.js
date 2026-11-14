import { createContext } from 'react';

// The context object lives apart from the provider so files that only need the hook
// (and the provider itself) don't break Vite's fast refresh.
export const AuthContext = createContext(null);
