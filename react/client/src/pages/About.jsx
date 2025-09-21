import React from 'react';
import '../css/About.css'; // ייבוא קובץ ה-CSS

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">אודותינו</h1>
        <div className="about-text-box">
          <p className="about-paragraph">
            ברוכה הבאה לעולם שבו השיער שלך זוכה למהפך אמיתי – טבעי, בריא ומלא ברק!
          </p>
          <p className="about-paragraph">
            אצלי תקבלי החלקה אורגנית ייחודית, מבוססת על חומרים טבעיים בלבד, המאושרת ע"י משרד הבריאות ומותאמת גם לנשים בהריון ולאחר לידה. ההחלקה לא רק מחליקה – היא <strong className="highlight-text">משקמת</strong>, מחייה ומעניקה לשיער מראה חלק, מבריק ובריא מהשורש ועד הקצוות – בלי נשירה, בלי שריפה ובלי פשרות.
          </p>
          <p className="about-paragraph">
            ההחלקה מחזיקה לצמיתות, עם אחריות מלאה על התוצאה – כי כשעובדים מהלב, התוצאה מדברת בעד עצמה.
          </p>
          <p className="about-paragraph">
            הטיפול נעשה באווירה פרטית ונעימה, לנשים בלבד, עם יחס אישי, דיוק ובלי לחץ.
          </p>
          <p className="about-paragraph final-paragraph">
            אם את חולמת על שיער חלק, חיוני ובריא – זה המקום שלך. בואי לגלות איך גם את יכולה להתאהב מחדש בשיער שלך.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;