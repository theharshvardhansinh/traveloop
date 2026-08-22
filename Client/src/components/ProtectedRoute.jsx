import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Props:
 *   children     — the component to render if allowed
 *   requiredRole — optional "user" | "admin". If omitted, any authenticated user is allowed.
 *   redirectTo   — where to redirect if check fails (defaults to "/login")
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Still hydrating from localStorage — show nothing (prevents flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Authenticated but wrong role
    const fallback = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
