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
      {/* Root redirect to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public auth pages */}
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/signup"       element={<Navigate to="/login?tab=register" replace />} />
      <Route path="/admin/signup" element={<AdminSignupPage />} />

      {/* Main App Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/itinerary/:id" element={<ItineraryDetailsPage />} />
      <Route path="/budget/:id" element={<BudgetPage />} />
      <Route path="/checklist/:id" element={<ChecklistPage />} />
      <Route path="/itinerary-builder" element={<ItineraryBuilderPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

      {/* Default redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
