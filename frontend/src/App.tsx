import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vulnerabilities from './pages/Vulnerabilities'
import Incidents from './pages/Incidents'
import Compliance from './pages/Compliance'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vulnerabilities" element={<Vulnerabilities />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="compliance" element={<Compliance />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App


