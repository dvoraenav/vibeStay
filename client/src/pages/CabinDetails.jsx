import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkAvailability, getCabinReviews } from '../api/bookingApi';
import { getImageUrl } from '../api/apiClient';
import './CabinDetails.css'; 

export default function CabinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCabinData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cabins/${id}`);
        if (!response.ok) throw new Error('Cabin not found');
        const data = await response.json();
        setCabin(data);
        
        const reviewsData = await getCabinReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCabinData();
  }, [id]);

  useEffect(() => {
    const checkDates = async () => {
      if (checkIn && checkOut) {
        if (new Date(checkIn) >= new Date(checkOut)) {
          setAvailabilityMsg('תאריך עזיבה חייב להיות אחרי תאריך הגעה');
          setIsAvailable(false);
          return;
        }

        try {
          const res = await checkAvailability(id, checkIn, checkOut);
          if (res.available) {
            setAvailabilityMsg('התאריכים פנויים! 🎉');
            setIsAvailable(true);
          } else {
            setAvailabilityMsg('לצערנו, הצימר תפוס בתאריכים אלו.');
            setIsAvailable(false);
          }
        } catch (error) {
          setAvailabilityMsg('שגיאה בבדיקת הזמינות.');
          setIsAvailable(false);
        }
      } else {
        setAvailabilityMsg('');
        setIsAvailable(false);
      }
    };
    checkDates();
  }, [checkIn, checkOut, id]);

  const handleBookingClick = () => {
    if (isAvailable) {
      navigate(`/book/${id}`, { state: { checkIn, checkOut } });
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (cabin && cabin.images) {
      setCurrentImageIndex((prev) => (prev + 1) % cabin.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (cabin && cabin.images) {
      setCurrentImageIndex((prev) => (prev - 1 + cabin.images.length) % cabin.images.length);
    }
  };

  if (loading) return <div className="loading-screen">טוען את פרטי הצימר...</div>;
  if (!cabin) return <div className="error-screen">הצימר לא נמצא</div>;

  const heroImage = cabin.images && cabin.images.length > 0 ? getImageUrl(cabin.images[0]) : 'https://via.placeholder.com/1200x600';
  const galleryImages = cabin.images || [];

  return (
    <div className="cabin-details-page">
      <header 
        className="details-hero" 
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="details-hero-overlay"></div>
        <div className="details-hero-content">
          <h1 className="details-hero-title">{cabin.name}</h1>
        </div>
      </header>

      <div className="details-main-container">
        <div className="details-info-section">
          <div className="about-section">
            <h2>על הצימר</h2>
            <p>{cabin.description || 'צימר מפנק באווירה פסטורלית ושקטה. מושלם לחופשה מרגיעה.'}</p>
          </div>

          <div className="amenities-grid">
            <div className="amenity-item"><span className="amenity-icon">🏊‍♂️</span>בריכה מחוממת</div>
            <div className="amenity-item"><span className="amenity-icon">🛁</span>ג'קוזי ספא פרטי</div>
            <div className="amenity-item"><span className="amenity-icon">🛏️</span>מיטת קינג סייז</div>
            <div className="amenity-item"><span className="amenity-icon">🍳</span>מטבחון מאובזר</div>
            <div className="amenity-item"><span className="amenity-icon">📶</span>אינטרנט אלחוטי</div>
            <div className="amenity-item"><span className="amenity-icon">📺</span>טלוויזיה חכמה</div>
            <div className="amenity-item"><span className="amenity-icon">☕</span>מכונת אספרסו</div>
          </div>

          <div className="gallery-section">
            <h2>גלריית תמונות</h2>
            <div className="gallery-grid">
              {galleryImages.map((imgUrl, index) => (
                <div key={index} className="gallery-item" onClick={() => openLightbox(index)}>
                  <img src={getImageUrl(imgUrl)} alt={`${cabin.name} - תמונה ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="cabin-reviews-section">
            <h2>תגובות וביקורות אורחים</h2>
            {reviews.length === 0 ? (
              <p className="no-reviews-msg">טרם נכתבו ביקורות לצימר זה. היו הראשונים להשאיר ביקורת!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <span className="review-author">{review.user_name}</span>
                      <span className="review-date">{new Date(review.created_at).toLocaleDateString('he-IL')}</span>
                    </div>
                    <div className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </div>
                    <p className="review-comment">"{review.comment}"</p>
                    
                    {review.admin_reply && (
                      <div className="admin-reply-box">
                        <div className="admin-reply-header">
                          <span className="admin-reply-icon">💬</span> תגובת ההנהלה
                        </div>
                        <p className="admin-reply-text">{review.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="booking-sidebar">
          <div className="sticky-booking-card">
            <div className="booking-price-header">
              <span className="price-amount">₪{cabin.price_per_night}</span>
              <span className="price-label"> / לילה</span>
            </div>
            
            <p className="booking-description">
              בחרו תאריכים כדי לבדוק זמינות:
            </p>

            <div className="date-picker-container">
              <div className="date-field">
                <label>תאריך הגעה:</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={checkIn} 
                  onChange={e => setCheckIn(e.target.value)} 
                />
              </div>
              <div className="date-field">
                <label>תאריך עזיבה:</label>
                <input 
                  type="date" 
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  value={checkOut} 
                  onChange={e => setCheckOut(e.target.value)} 
                />
              </div>
            </div>

            {availabilityMsg && (
              <div className={`availability-msg ${isAvailable ? 'success' : 'error'}`}>
                {availabilityMsg}
              </div>
            )}

            {isAvailable && (
              <button onClick={handleBookingClick} className="btn-reserve-large animated-btn">
                המשך למעמד תשלום
              </button>
            )}
            
            <ul className="booking-perks">
              <li>✔️ אישור מיידי</li>
              <li>✔️ תמיכה 24/7</li>
              <li>✔️ אין עמלות הזמנה נסתרות</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && cabin.images && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>❮</button>
            <img src={getImageUrl(cabin.images[currentImageIndex])} alt="Gallery Large" className="lightbox-img" />
            <button className="lightbox-nav lightbox-next" onClick={nextImage}>❯</button>
          </div>
        </div>
      )}
    </div>
  );
}