import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardShell } from './components/layout/DashboardShell';
import { Dashboard } from './pages/dashboard/Dashboard';
import { GoalsPage } from './pages/dashboard/GoalsPage';
import { FinancesPage } from './pages/dashboard/FinancesPage';
import { HabitsPage } from './pages/dashboard/HabitsPage';
import { TodosPage } from './pages/dashboard/TodosPage';
import { HealthPage } from './pages/dashboard/HealthPage';
import { BucketListPage } from './pages/dashboard/BucketListPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="finances" element={<FinancesPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="bucketlist" element={<BucketListPage />} />
      </Route>
    </Routes>
  );
};
