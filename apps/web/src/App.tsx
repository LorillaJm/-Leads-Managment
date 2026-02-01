import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/layout/Layout'
import { Toaster } from './components/ui/toaster'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { LeadsNew } from './pages/LeadsNew'
import { LeadDetails } from './pages/LeadDetails'
import { ClosedDeals } from './pages/ClosedDeals'
import { Performance } from './pages/Performance'
import { Users } from './pages/Users'

function App() {
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
                    <Route path="/" element={<Dashboard />} />
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