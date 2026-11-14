import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from './routes/guards';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeList from './pages/EmployeeList';
import EmployeeAdd from './pages/EmployeeAdd';
import EmployeeDetails from './pages/EmployeeDetails';
import EmployeeEdit from './pages/EmployeeEdit';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<EmployeeAdd />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/employees/:id/edit" element={<EmployeeEdit />} />
        </Route>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}