import React, { useState, useEffect } from 'react';
import { getAllBookings, updateCabinPrice, addCabin, getStats, updateBookingStatus, getAllReviews, deleteReview, replyToReview, getContactMessages, updateMessageStatus, deleteMessage } from '../api/adminApi';
import { getAllCabins } from '../api/cabinApi';
import { getImageUrl } from '../api/apiClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'bookings', 'cabins'
  
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [cabins, setCabins] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Reply State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  const [newPrice, setNewPrice] = useState({});
  const [newCabin, setNewCabin] = useState({
    name: '', location: '', price_per_night: '', description: ''
  });
  const [images, setImages] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, bookingsData, cabinsData, reviewsData, messagesData] = await Promise.all([
        getStats(),
        getAllBookings(),
        getAllCabins(),
        getAllReviews(),
        getContactMessages()
      ]);
      
      setStats(statsData);
      setBookings(bookingsData);
      setCabins(cabinsData);
      setReviews(reviewsData);
      setMessagesList(messagesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setMessage('סטטוס ההזמנה עודכן בהצלחה');
      fetchData(); // Refresh to get updated stats and bookings
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePriceUpdate = async (cabinId) => {
    try {
      await updateCabinPrice(cabinId, newPrice[cabinId]);
      setMessage('המחיר עודכן בהצלחה');
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('האם את בטוחה שברצונך למחוק ביקורת זו?')) return;
    try {
      await deleteReview(id);
      setMessage('הביקורת נמחקה בהצלחה');
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleOpenReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.admin_reply || '');
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await replyToReview(selectedReview.id, replyText);
      setMessage('התגובה נשמרה בהצלחה!');
      setReplyModalOpen(false);
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAddCabin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCabin.name);
      formData.append('location', newCabin.location);
      formData.append('price_per_night', newCabin.price_per_night);
      formData.append('description', newCabin.description);
      
      if (images) {
        Array.from(images).forEach(file => {
          formData.append('images', file);
        });
      }

      await addCabin(formData);
      setMessage('הצימר נוסף בהצלחה עם התמונות');
      fetchData();
      setNewCabin({ name: '', location: '', price_per_night: '', description: '' });
      setImages(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleMessageStatus = async (id, status) => {
    try {
      await updateMessageStatus(id, status);
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('האם למחוק הודעה זו?')) return;
    try {
      await deleteMessage(id);
      setMessage('הודעה נמחקה');
      fetchData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <div className="admin-loading">טוען נתונים...</div>;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">לוח בקרה</h2>
        <ul className="sidebar-menu">
          <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            📊 סטטיסטיקות
          </li>
          <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>📦 ניהול הזמנות</li>
          <li className={activeTab === 'cabins' ? 'active' : ''} onClick={() => setActiveTab('cabins')}>🏠 ניהול צימרים</li>
          <li className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>⭐ ניהול ביקורות</li>
          <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            📩 הודעות גולשים 
            {messagesList.filter(m => m.status === 'unread').length > 0 && (
              <span style={{background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', marginLeft: '5px'}}>
                {messagesList.filter(m => m.status === 'unread').length}
              </span>
            )}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {message && <div className="admin-message">{message} <button onClick={() => setMessage('')}>X</button></div>}

        {activeTab === 'overview' && (
          <section className="admin-section">
            <h2 className="section-header">מבט כללי (Overview)</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>סך כל ההכנסות</h3>
                <p className="stat-value">₪{stats.totalRevenue ? parseFloat(stats.totalRevenue).toLocaleString() : 0}</p>
                <span className="stat-desc">מהזמנות מאושרות</span>
              </div>
              <div className="stat-card">
                <h3>סך הכל הזמנות</h3>
                <p className="stat-value">{stats.totalBookings}</p>
                <span className="stat-desc">הזמנות במערכת</span>
              </div>
              <div className="stat-card">
                <h3>צימרים פעילים</h3>
                <p className="stat-value">{stats.totalCabins}</p>
                <span className="stat-desc">כמות צימרים במערכת</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="admin-section">
            <h2 className="section-header">ניהול הזמנות חכם</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>מס' הזמנה</th>
                    <th>לקוח</th>
                    <th>צימר</th>
                    <th>תאריכים</th>
                    <th>מחיר</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>{b.user_name}</td>
                      <td>{b.cabin_name}</td>
                      <td>{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</td>
                      <td>₪{b.total_price}</td>
                      <td>
                        <span className={`status-badge status-${b.status}`}>
                          {b.status === 'confirmed' ? 'מאושר' : b.status === 'cancelled' ? 'בוטל' : 'ממתין'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {b.status !== 'confirmed' && (
                          <button className="btn-approve" onClick={() => handleStatusUpdate(b.id, 'confirmed')}>אשר</button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button className="btn-cancel" onClick={() => handleStatusUpdate(b.id, 'cancelled')}>בטל</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{textAlign:'center', padding:'20px'}}>אין הזמנות כרגע.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'cabins' && (
          <section className="admin-section">
            <h2 className="section-header">ניהול צימרים</h2>
            
            <div className="admin-cabins-grid">
              {cabins.map(cabin => (
                <div key={cabin.id} className="admin-cabin-card">
                  <img src={getImageUrl(cabin.images?.[0])} alt={cabin.name} className="admin-cabin-img" />
                  <div className="admin-cabin-info">
                    <h3>{cabin.name}</h3>
                    <p>מחיר: ₪{cabin.price_per_night} / לילה</p>
                    <div className="price-update-form">
                      <input 
                        type="number" 
                        placeholder="מחיר חדש" 
                        value={newPrice[cabin.id] || ''}
                        onChange={(e) => setNewPrice({...newPrice, [cabin.id]: e.target.value})}
                      />
                      <button className="btn-update" onClick={() => handlePriceUpdate(cabin.id)}>עדכן</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-cabin-wrapper">
              <h3>הוספת צימר חדש</h3>
              <form className="add-cabin-form" onSubmit={handleAddCabin}>
                <div className="form-row">
                  <input type="text" placeholder="שם הצימר" value={newCabin.name} onChange={e => setNewCabin({...newCabin, name: e.target.value})} required />
                  <input type="text" placeholder="מיקום (יישוב)" value={newCabin.location} onChange={e => setNewCabin({...newCabin, location: e.target.value})} required />
                  <input type="number" placeholder="מחיר ללילה (₪)" value={newCabin.price_per_night} onChange={e => setNewCabin({...newCabin, price_per_night: e.target.value})} required />
                </div>
                <textarea placeholder="תיאור מפורט של הצימר..." rows="4" value={newCabin.description} onChange={e => setNewCabin({...newCabin, description: e.target.value})} required />
                <div className="file-upload-wrapper">
                  <label>בחר תמונות להעלאה (ניתן לבחור כמה ביחד):</label>
                  <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} />
                </div>
                <button type="submit" className="btn-submit">הוסף צימר למערכת</button>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="admin-section">
            <h2 className="section-header">ניהול ביקורות מלקוחות</h2>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>תאריך</th>
                    <th>צימר</th>
                    <th>לקוח</th>
                    <th>דירוג</th>
                    <th>ביקורת</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id}>
                      <td>{new Date(r.created_at).toLocaleDateString('he-IL')}</td>
                      <td>{r.cabin_name}</td>
                      <td>{r.user_name}</td>
                      <td>{'⭐'.repeat(r.rating)}</td>
                      <td>
                        {r.comment}
                        {r.admin_reply && (
                          <div style={{marginTop: '10px', fontSize: '0.9em', color: '#16a085', background: '#e8f8f5', padding: '5px', borderRadius: '4px'}}>
                            <strong>תגובתך: </strong>{r.admin_reply}
                          </div>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button className="btn-approve" onClick={() => handleOpenReply(r)} style={{marginLeft: '10px'}}>
                          {r.admin_reply ? 'ערוך תגובה' : 'הגב'}
                        </button>
                        <button className="btn-cancel" onClick={() => handleDeleteReview(r.id)}>מחק</button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign:'center', padding:'20px'}}>אין ביקורות כרגע.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <section className="admin-section">
            <h2>📩 פניות מלקוחות</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>תאריך</th>
                    <th>שם מלא</th>
                    <th>אימייל</th>
                    <th>טלפון</th>
                    <th>הודעה</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {messagesList.map(m => (
                    <tr key={m.id} style={{ fontWeight: m.status === 'unread' ? 'bold' : 'normal', background: m.status === 'unread' ? '#fff9e6' : 'transparent' }}>
                      <td>{new Date(m.created_at).toLocaleDateString('he-IL')}</td>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.phone}</td>
                      <td style={{maxWidth: '300px'}}>{m.message}</td>
                      <td>{m.status === 'unread' ? '🔴 לא נקרא' : '🟢 טופל'}</td>
                      <td className="actions-cell">
                        {m.status === 'unread' ? (
                          <button className="btn-approve" onClick={() => handleMessageStatus(m.id, 'read')}>סמן כטופל</button>
                        ) : (
                          <button className="btn-approve" style={{background: '#95a5a6'}} onClick={() => handleMessageStatus(m.id, 'unread')}>סמן כלא נקרא</button>
                        )}
                        <button className="btn-cancel" onClick={() => handleDeleteMessage(m.id)}>מחק</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="modal-overlay" onClick={() => setReplyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setReplyModalOpen(false)}>×</button>
            <h2>תגובת הנהלה לביקורת של {selectedReview?.user_name}</h2>
            <textarea
              style={{ width: '100%', minHeight: '100px', padding: '10px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="כתבי כאן את תגובתך ללקוח..."
            />
            <button className="btn-reserve-large" style={{marginTop: '20px'}} onClick={handleReplySubmit}>שמור תגובה</button>
          </div>
        </div>
      )}
    </div>
  );
}
