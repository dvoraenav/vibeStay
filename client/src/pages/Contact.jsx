import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('שגיאה בשליחת ההודעה');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert('אופס, משהו השתבש. אנא נסה שנית.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>יצירת קשר</h1>
        <p>נשמח לעמוד לשירותכם בכל שאלה או בקשה. מלאו את הטופס או צרו קשר ישירות.</p>
        
        <div className="contact-info">
          <div className="info-item">
            <span className="icon">📞</span>
            <p>054-9481195</p>
          </div>
          <div className="info-item">
            <span className="icon">✉️</span>
            <p>info@vibestay.co.il</p>
          </div>
          <div className="info-item">
            <span className="icon">📍</span>
            <p>אמירים, גליל עליון</p>
          </div>
        </div>

        {submitted ? <p>תודה! הודעתך התקבלה.</p> : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="שם מלא" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <input type="email" placeholder="אימייל" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <textarea placeholder="איך נוכל לעזור?" rows="5" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <button type="submit" className="submit-btn">שלח הודעה</button>
          </form>
        )}
      </div>
    </div>
  );
}
