import React from 'react';
import '../css/FooterInfo.css';

function FooterInfo() {
  return (
    <footer className="footer-info-section">
      <div className="footer-info-container">
        
        {/* קטגוריה 1: פרטי קשר */}
        <div className="info-column">
          <h3>יצירת קשר</h3>
          <p>
            כתובת: רחוב הדוגמה 123, עיר הדוגמה
          </p>
          <p>
            טלפון: 05X-XXXXXXX
          </p>
          <p>
            דוא"ל: info@example.com
          </p>
        </div>

        {/* קטגוריה 2: שעות פעילות */}
        <div className="info-column">
          <h3>שעות פעילות</h3>
          <p>
            א' - ה': 09:00 - 18:00
          </p>
          <p>
            ו': 09:00 - 13:00
          </p>
          <p>
            שבת: סגור
          </p>
        </div>

        {/* קטגוריה 3: קישורים שימושיים */}
        <div className="info-column">
          <h3>קישורים שימושיים</h3>
          <ul>
            <li><a href="#">מדיניות פרטיות</a></li>
            <li><a href="#">תנאי שימוש</a></li>
            <li><a href="#">שאלות נפוצות</a></li>
          </ul>
        </div>
        
      </div>
      <div className="copyright">
        &copy; 2025 כל הזכויות שמורות.
      </div>
    </footer>
  );
}

export default FooterInfo;