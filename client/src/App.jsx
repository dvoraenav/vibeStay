import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 👈 1. יבוא ה-Footer
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CabinDetails from './pages/CabinDetails';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cabins/:id"
          element={
            <ProtectedRoute>
              <CabinDetails />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer /> {/* 👈 2. חיבור ה-Footer כאן מבטיח שהוא יופיע בכל עמוד! */}
    </Router>
  );
}