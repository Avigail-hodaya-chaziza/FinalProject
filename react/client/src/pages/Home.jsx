// 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/home.css';

import FooterInfo from './FooterInfo';
import StarRating from './StarRating';
import About from './About';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="overlay"></div>
      <main className="home-content">
        <h1 className="home-title">ברוכה הבאה לסטודיו להחלקות שיער</h1>
        <p className="home-subtitle">
          המקום שלך לטיפולי שיער מתקדמים, החלקות ברמה הגבוהה ביותר ושירות אישי
        </p>
        <About />
        <button className="home-btn" onClick={() => navigate('/treatments')}>
          ✨ קביעת תור עכשיו
        </button>
      </main>
      <div className="extras">
        <StarRating />
        <FooterInfo />
      </div>
    </div>
  );
};

export default Home;
