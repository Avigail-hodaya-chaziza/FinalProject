import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/AdminLogin.css'; // ייבוא קובץ ה-CSS

export default function AdminLogin() {
    const navigate = useNavigate();
    useEffect(() => {
    const adminName = localStorage.getItem('adminName');
    if (!adminName) {
      alert('אין גישה לדף זה');
      navigate('/login');
    }
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-box">
        <h2 className="admin-title">ברוכה הבאה, מנהלת 👩‍💼</h2>
        <p className="admin-subtitle">לוח בקרה</p>

        <ul className="admin-actions-list">
          <li className="admin-action-item">
            <Link to="/AddTreatmentForm" className="admin-action-link">הוספת טיפול</Link>
          </li>
          <li className="admin-action-item">
            <Link to="/treatments?mode=edit" className="admin-action-link">עריכת טיפול</Link>
          </li>
          <li className="admin-action-item">
            <Link to="/TreatmentTypes" className="admin-action-link">מחיקת טיפול</Link>
          </li>
          <li className="admin-action-item">
            <Link to="/IsContact" className="admin-action-link">יצירת קשר עם לקוחות</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}