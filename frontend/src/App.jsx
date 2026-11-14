import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import NavBar from './components/NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function Layout() {
  const location = useLocation();
  return (
    <>
      <NavBar />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* key resets the boundary when the route changes, so one crash doesn't stick */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </Container>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/employees" replace />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/add" element={<AddEmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
