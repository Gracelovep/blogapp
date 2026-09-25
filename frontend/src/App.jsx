import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  // Login/Register are modals that can be opened from anywhere via the navbar.
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'register'

  return (
    <AuthProvider>
      <Navbar onOpenLogin={() => setAuthModal('login')} onOpenRegister={() => setAuthModal('register')} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {authModal === 'login' && (
        <LoginModal onClose={() => setAuthModal(null)} onSwitchToRegister={() => setAuthModal('register')} />
      )}
      {authModal === 'register' && (
        <RegisterModal onClose={() => setAuthModal(null)} onSwitchToLogin={() => setAuthModal('login')} />
      )}
    </AuthProvider>
  );
}
