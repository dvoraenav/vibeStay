import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCabinById } from '../api/cabinApi';
import { createBooking } from '../api/bookingApi';
import './BookingPage.css';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [dates, setDates] = useState({ 
    checkIn: location.state?.checkIn || '', 
    checkOut: location.state?.checkOut || '' 
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCabin();
  }, [id]);

  useEffect(() => {
    calculatePrice();
  }, [dates, cabin]);

  const fetchCabin = async () => {
    try {
      const data = await getCabinById(id);
      setCabin(data);
    } catch (err) {
      setError('לא ניתן לטעון את פרטי הצימר');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (dates.checkIn && dates.checkOut && cabin) {
      const start = new Date(dates.checkIn);
      const end = new Date(dates.checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 0) {
        setTotalPrice(diffDays * cabin.price_per_night);
      } else {
        setTotalPrice(0);
      }
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    
    if (totalPrice <= 0) {
      setError('יש לבחור תאריכים תקינים (לפחות לילה אחד)');
      return;
    }

    try {
      await createBooking({
        cabin_id: id,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        total_price: totalPrice
      });
      
      // Navigate to guest profile upon success
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">טוען נתונים...</div>;
  if (!cabin) return <div className="error">{error}</div>;

  return (
    <div className="booking-page-container">
      <div className="booking-card">
        <h1>הזמנת חופשה ב{cabin.name}</h1>
        <p className="cabin-location">מיקום: {cabin.location}</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleBooking} className="booking-form">
          <div className="dates-selection">
            <div className="date-input">
              <label>תאריך הגעה:</label>
              <input 
                type="date" 
                required
                min={new Date().toISOString().split('T')[0]}
                value={dates.checkIn} 
                onChange={(e) => setDates({...dates, checkIn: e.target.value})}
              />
            </div>
            <div className="date-input">
              <label>תאריך עזיבה:</label>
              <input 
                type="date" 
                required
                min={dates.checkIn || new Date().toISOString().split('T')[0]}
                value={dates.checkOut} 
                onChange={(e) => setDates({...dates, checkOut: e.target.value})}
              />
            </div>
          </div>

          <div className="price-summary">
            <h3>סה"כ לתשלום: ₪{totalPrice}</h3>
            <p className="price-note">(לפי ₪{cabin.price_per_night} ללילה)</p>
          </div>

          <div className="payment-simulation">
            <h4>פרטי תשלום (סימולציה)</h4>
            <input type="text" placeholder="מספר כרטיס אשראי" required />
            <div className="credit-card-details">
              <input type="text" placeholder="MM/YY" required />
              <input type="text" placeholder="CVV" required />
            </div>
          </div>

          <button type="submit" className="btn-book-now">אישור ובצע הזמנה</button>
        </form>
      </div>
    </div>
  );
}
