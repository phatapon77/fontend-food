import { Navigate } from 'react-router-dom';
import useAuthStore from "../../store/authStore";

export const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" replace />;
  return children;
};