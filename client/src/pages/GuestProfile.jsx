import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../api/bookingApi';
import { addReview } from '../api/bookingApi';
import './GuestProfile.css';

export default function GuestProfile() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCabinId, setSelectedCabinId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        cabin_id: selectedCabinId,
        rating,
        comment
      });
      setMessage('הביקורת נשלחה בהצלחה! תודה רבה.');
      closeModal();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const openReviewModal = (cabinId) => {
    setSelectedCabinId(cabinId);
    setRating(5);
    setComment('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCabinId(null);
  };

  if (loading) return <div className="guest-loading">טוען נתונים...</div>;

  const today = new Date();
  
  const futureBookings = bookings.filter(b => new Date(b.check_in) >= today || new Date(b.check_out) >= today);
  const pastBookings = bookings.filter(b => new Date(b.check_out) < today);

  return (
    <div className="guest-profile-container">
      <header className="profile-header">
        <h1>האזור האישי שלי</h1>
        <p>כאן תוכלו לעקוב אחר ההזמנות שלכם, לשתף חוויות ולהזמין את החופשה הבאה.</p>
      </header>

      {message && (
        <div className="profile-message">
          <span>{message}</span>
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      <main className="profile-main">
        <section className="bookings-section">
          <h2>הזמנות קרובות 🌴</h2>
          <div className="bookings-grid">
            {futureBookings.length === 0 ? (
              <p className="empty-state">אין הזמנות עתידיות כרגע.</p>
            ) : (
              futureBookings.map(b => (
                <div key={b.id} className="booking-card future-booking">
                  <div className="card-top">
                    <h3>{b.cabin_name}</h3>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status === 'confirmed' ? 'מאושר' : b.status === 'cancelled' ? 'בוטל' : 'ממתין'}
                    </span>
                  </div>
                  <div className="card-body">
                    <p>📅 <strong>תאריכים:</strong> {new Date(b.check_in).toLocaleDateString('he-IL')} - {new Date(b.check_out).toLocaleDateString('he-IL')}</p>
                    <p>📍 <strong>מיקום:</strong> {b.location}</p>
                    <p>💳 <strong>סה"כ לתשלום:</strong> ₪{b.total_price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bookings-section">
          <h2>היסטוריית הזמנות 📖</h2>
          <div className="bookings-grid">
            {pastBookings.length === 0 ? (
              <p className="empty-state">טרם התארחתם אצלנו.</p>
            ) : (
              pastBookings.map(b => (
                <div key={b.id} className="booking-card past-booking">
                  <div className="card-top">
                    <h3>{b.cabin_name}</h3>
                    <span className="date-past">הסתיים ב: {new Date(b.check_out).toLocaleDateString('he-IL')}</span>
                  </div>
                  <div className="card-action">
                    {b.status === 'confirmed' && (
                      <button className="btn-review" onClick={() => openReviewModal(b.cabin_id)}>
                        ⭐ השאר ביקורת
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>איך הייתה החופשה?</h2>
            <form onSubmit={handleReviewSubmit} className="review-form">
              
              <div className="star-rating-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    className={`star ${star <= rating ? 'selected' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea 
                placeholder="ספרו לנו על החוויה שלכם..."
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" className="btn-submit-review">שליחת ביקורת</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
