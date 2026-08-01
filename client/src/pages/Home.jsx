import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // 👈 יבוא קובץ ה-CSS

export default function Home() {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/cabins')
      .then((res) => res.json())
      .then((data) => {
        setCabins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cabins:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}>Loading suites...</div>;

  return (
    <div className="home-page">
      <header className="hero">
        <h1 className="hero-title">Luxury Accommodations</h1>
        <p className="hero-subtitle">Experience serenity & nature in Amirim</p>
      </header>

      <main className="home-container">
        <h2 className="section-title">Our Private Suites</h2>
        <div className="cabins-grid">
          {cabins.map((cabin) => (
            <div
              key={cabin.id}
              className="cabin-card"
              onClick={() => navigate(`/cabins/${cabin.id}`)}
            >
              <div className="card-image-wrapper">
                <img
                  src={cabin.primary_image || 'https://via.placeholder.com/400x250'}
                  alt={cabin.name}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h3 className="cabin-name">{cabin.name}</h3>
                <p className="cabin-location">{cabin.location}</p>
                <div className="card-footer">
                  <span className="cabin-price">${cabin.price_per_night} / night</span>
                  <span className="details-btn">View Details &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}