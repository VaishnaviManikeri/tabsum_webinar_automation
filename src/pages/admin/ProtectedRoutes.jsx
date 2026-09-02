import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
