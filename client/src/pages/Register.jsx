import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f9f9f9' },
  card: { padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { color: '#333', marginBottom: '20px', fontFamily: 'sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
  footerText: { marginTop: '15px', fontSize: '14px', color: '#666' },
  link: { color: '#2c3e50', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: '10px' }
};