// src/pages/EmployeeDetails.jsx
import { useParams } from 'react-router-dom';
import PageStub from '../components/PageStub';
export default function EmployeeDetails() {
  const { id } = useParams();
  return <PageStub title={`Employee ${id}`} />;
}