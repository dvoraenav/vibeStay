import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span>📞 <a href="tel:0549481195" className="phone-link">+972-54-9481195</a></span>
      </div>

      <Link to="/" className="nav-logo">
        VibeStay 🌿
      </Link>

      <div className="nav-right">
        {token ? (
          <>
            <Link to="/" className="nav-link">Suites</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}