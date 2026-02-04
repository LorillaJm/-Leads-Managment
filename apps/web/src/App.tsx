import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/layout/Layout'
import { Toaster } from './components/ui/toaster'
import { Login } from './pages/Login'
import { DashboardOriginal } from './pages/DashboardOriginal'
import { LeadsNew } from './pages/LeadsNew'
import { LeadDetails } from './pages/LeadDetails'
import { ClosedDeals } from './pages/ClosedDeals'
import { Performance } from './pages/Performance'
import { Users } from './pages/Users'
import { DeploymentInfo } from './pages/DeploymentInfo'

// Check if API is available
const API_URL = import.meta.env.VITE_API_URL;
// Only show deployment info if API_URL is completely missing or empty
// Allow localhost for local development
const isApiConfigured = API_URL && API_URL.trim() !== '';

function App() {
  // Show deployment info only if API is not configured at all
  if (!isApiConfigured) {
    return <DeploymentInfo />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardOriginal />} />
                    <Route path="/leads" element={<LeadsNew />} />
                    <Route path="/leads/:id" element={<LeadDetails />} />
                    <Route path="/closed-deals" element={<ClosedDeals />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App