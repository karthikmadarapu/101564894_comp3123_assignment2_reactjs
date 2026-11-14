// src/pages/EmployeeEdit.jsx
import { useParams } from 'react-router-dom';
import PageStub from '../components/PageStub';
export default function EmployeeEdit() {
  const { id } = useParams();
  return <PageStub title={`Edit employee ${id}`} />;
}