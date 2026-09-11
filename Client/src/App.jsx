import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminSignupPage from './pages/AdminSignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ItineraryDetailsPage from './pages/ItineraryDetailsPage';
import BudgetPage from './pages/BudgetPage';
import ChecklistPage from './pages/ChecklistPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public auth — unified Sign In + Register tabs */}
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/signup"       element={<Navigate to="/login?tab=register" replace />} />
      <Route path="/admin/signup" element={<AdminSignupPage />} />

      {/* Protected — users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/itinerary/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <ItineraryDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/budget/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <BudgetPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checklist/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <ChecklistPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — itinerary builder */}
      <Route
        path="/itinerary-builder"
        element={
          <ProtectedRoute requiredRole="user">
            <ItineraryBuilderPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — admins */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
