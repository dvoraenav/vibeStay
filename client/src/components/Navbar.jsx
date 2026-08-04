import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-btn">ראשי</Link>
        <Link to="/contact" className="nav-btn">יצירת קשר</Link>
      </div>

      <Link to="/" className="nav-logo">
        VibeStay 🌿
      </Link>

      <div className="nav-right">
        {token ? (
          <>
            {user && <span className="nav-welcome">ברוך הבא, {user.fullName}</span>}
            <Link to="/profile" className="nav-link">אזור אישי</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link">ניהול</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">התנתק</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">התחברות</Link>
            <Link to="/register" className="nav-link">הרשמה</Link>
          </>
        )}
      </div>
    </nav>
  );
}