import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AdminLogin } from './pages/AdminLogin';
import { MarketingLogin } from './pages/MarketingLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { MarketingDashboard } from './pages/MarketingDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/marketing/login" element={<MarketingLogin />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute 
                requiredRoles={['admin']} 
                redirectTo="/admin/login"
              >
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/marketing/dashboard" 
            element={
              <ProtectedRoute 
                requiredRoles={['campaign_manager', 'analyst', 'operator']} 
                redirectTo="/marketing/login"
              >
                <MarketingDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
