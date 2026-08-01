import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CabinDetails.css'; // 👈 יבוא קובץ ה-CSS

export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/cabins/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCabin(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to complete your booking.');
      return navigate('/login');
    }

    alert(`Reservation request sent for dates: ${checkIn} to ${checkOut}`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '20px' }}>Loading suite details...</div>;
  if (!cabin) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '20px' }}>Suite not found</div>;

  return (
    <div className="details-page">
     {/* Hero Banner Cover like reference image */}
        <header 
        className="details-hero" 
        style={{ backgroundImage: `url(${cabin.primary_image || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200'})` }}
        >
        <div className="details-hero-overlay"></div>
        <div className="details-hero-card">
            <h1 className="details-hero-title">{cabin.name}</h1>
        </div>
        </header>

      <div className="details-container">
        {/* Amenities Bar */}
        <div className="amenities-bar">
          <div className="amenity-item"><span className="amenity-icon">🏊‍♂️</span><span>Heated Pool</span></div>
          <div className="amenity-item"><span className="amenity-icon">🛁</span><span>Private Jacuzzi</span></div>
          <div className="amenity-item"><span className="amenity-icon">🛏️</span><span>King Bed</span></div>
          <div className="amenity-item"><span className="amenity-icon">🍳</span><span>Kitchenette</span></div>
          <div className="amenity-item"><span className="amenity-icon">📶</span><span>Fast WiFi</span></div>
          <div className="amenity-item"><span className="amenity-icon">📺</span><span>Smart TV</span></div>
          <div className="amenity-item"><span className="amenity-icon">☕</span><span>Espresso Machine</span></div>
        </div>

        {/* Content Layout Grid */}
        <div className="main-content-grid">
          
          {/* Left Column: Gallery */}
          <div className="gallery-grid">
            {cabin.images && cabin.images.length > 0 ? (
              cabin.images.map((img) => (
                <img key={img.id} src={img.image_url} alt={cabin.name} className="gallery-img" />
              ))
            ) : (
              <img src={cabin.primary_image || 'https://via.placeholder.com/400x250'} alt={cabin.name} className="gallery-img" />
            )}
          </div>

          {/* Right Column: Text & Booking */}
          <div className="description-section">
            <h2 className="description-title">About {cabin.name}</h2>
            <p className="description-text">
              {cabin.description || 
                'An elegant and luxurious suite surrounded by natural scenery. Fully equipped with a private jacuzzi, high-end amenities, and ultimate tranquility for an unforgettable getaway.'}
            </p>
            
            <div className="price-tag">${cabin.price_per_night} / night</div>

            {/* Booking Form */}
            <div className="booking-card">
              <h3 className="booking-title">Book Your Stay</h3>
              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-group">
                  <label>Check-in Date:</label>
                  <input 
                    type="date" 
                    required 
                    value={checkIn} 
                    onChange={(e) => setCheckIn(e.target.value)} 
                    className="date-input" 
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date:</label>
                  <input 
                    type="date" 
                    required 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)} 
                    className="date-input" 
                  />
                </div>
                <button type="submit" className="reserve-btn">Reserve Now</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}