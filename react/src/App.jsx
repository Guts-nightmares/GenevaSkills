// Gère toutes les routes et la protection des pages

import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import Dashboard from '@/pages/Dashboard'
import Categories from '@/pages/Categories'
import { Toaster } from '@/components/ui/toaster'
import Footer from './components/layout/Footer'

// Bloque l'accès aux pages si pas connecté
function ProtectedRoute({ children }) {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Redirige vers le dashboard si déjà connecté
function PublicRoute({ children }) {
  if (localStorage.getItem('token')) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        {/* Route par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster  />
    </Router>
  )
}
