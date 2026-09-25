import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        📝 <span>Blog</span>App
      </Link>

      <nav className="navbar-links">
        <Link to="/">Home</Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span className="navbar-user">👤 {user.name}</span>
            <button type="button" className="btn btn-danger btn-small" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" className="navbar-link-button" onClick={onOpenLogin}>
              Login
            </button>
            <button type="button" className="navbar-link-button" onClick={onOpenRegister}>
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
