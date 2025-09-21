import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; // חיבור לקובץ העיצוב

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">דף הבית</Link>
      <Link to="/login">התחברות / קביעת פגישה</Link>
      <Link to="/About">אודות</Link>
      <Link to="/IsContact">צור קשר</Link>
      <Link to="/CalendarWithDisabledDates">לוח שנה </Link>
      <Link to="/AdminLogin">דף ניהול</Link>
      {/* תוסיף עוד קישורים אם תרצה */}
    </nav>
  );
};

export default Navbar;
