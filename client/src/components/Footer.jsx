export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* כותרות ומפה */}
      <div style={styles.mapSection}>
        <h2 style={styles.title}>How to Get Here?</h2>
        <div style={styles.mapWrapper}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13418.670260424685!2d35.4431835!3d32.9366113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c3e3a9a79782b%3A0x6b4f7a1f59ef8c8e!2sAmirim!5e0!3m2!1sen!2sil!4v1700000000000!5m2!1sen!2sil"
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: '4px' }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* פרטי התקשרות בשורה אחת */}
      <div style={styles.contactRow}>
        <div style={styles.contactItem}>
          <span>📍 Amirim, North Israel</span>
        </div>
        <div style={styles.contactItem}>
          <span>📞 +972-54-9481195</span>
        </div>
        <div style={styles.contactItem}>
          <span>✉️ zimmer.amirim@gmail.com</span>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* זכויות יוצרים ותחתית */}
      <div style={styles.bottomRow}>
        <p>© 2026 VibeStay. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: { backgroundColor: '#fcfbf7', borderTop: '1px solid #e8e2d5', paddingTop: '40px', paddingBottom: '20px', color: '#4a3b32', fontFamily: 'serif' },
  mapSection: { maxWidth: '1100px', margin: '0 auto 30px auto', padding: '0 20px', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: '400', marginBottom: '20px', color: '#4a3b32' },
  mapWrapper: { borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  contactRow: { display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto 20px auto', fontSize: '15px' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  divider: { maxWidth: '1100px', margin: '20px auto', border: 'none', borderTop: '1px solid #e8e2d5' },
  bottomRow: { textAlign: 'center', fontSize: '13px', color: '#8c7a6b' }
};