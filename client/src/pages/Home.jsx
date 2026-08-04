
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/apiClient';
import './Home.css';

export default function Home() {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/cabins')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
       
        if (Array.isArray(data)) {
          setCabins(data);
        } else {
          console.error('Expected an array but got:', data);
          setCabins([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cabins:', err);
        setError('Failed to load cabins. Please check your backend connection.');
        setCabins([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '18px' }}>Loading suites...</div>;

  return (
    <div className="home-page">
      <header className="hero">
        <h1 className="hero-title">Luxury Accommodations</h1>
        <p className="hero-subtitle">Experience serenity & nature in Amirim</p>
      </header>

      <main className="home-container">
        <h2 className="section-title">Our Private Suites</h2>

        {error && <div style={{ textAlign: 'center', color: '#d9534f', marginBottom: '20px' }}>{error}</div>}

        <div className="cabins-grid">
          {Array.isArray(cabins) && cabins.length > 0 ? (
            cabins.map((cabin) => {
              // חילוץ נתיב תמונה בטוח (בין אם מדובר ב-primary_image או מערך images)
              const firstImage = cabin.primary_image || (cabin.images && cabin.images[0]?.image_url) || cabin.images?.[0];

              return (
                <div
                  key={cabin.id}
                  className="cabin-card"
                  onClick={() => navigate(`/cabins/${cabin.id}`)}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={getImageUrl ? getImageUrl(firstImage) : (firstImage || 'https://via.placeholder.com/400x250')}
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
              );
            })
          ) : (
            !error && <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#666' }}>No suites available at the moment.</div>
          )}
        </div>
      </main>
    </div>
  );
}