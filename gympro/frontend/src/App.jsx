import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MemberDashboard from './pages/MemberDashboard'
import TrainerDashboard from './pages/TrainerDashboard'

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />
  return children
}

const DashboardRouter = () => {
  const { user } = useAuth()
  if (user?.role === 'trainer') return <TrainerDashboard />
  return <MemberDashboard />
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/dashboard/member" element={<ProtectedRoute role="member"><MemberDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/trainer" element={<ProtectedRoute role="trainer"><TrainerDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
