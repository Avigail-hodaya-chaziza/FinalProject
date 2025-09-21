import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerForm from '../Slice/Customer/CustomerForm';
import { FindByIdAndEmail } from '../Services/customerApi';
import { checkIfAdmin } from '../Services/adminApi';
import { useDispatch } from 'react-redux';
import { saveAppointment } from '../Slice/Appointment/AppointmentSlice';
import GoogleLogin from '../Components/GoogleLogin';
import '../css/login.css';

export default function Login() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const chosenTreatment = location.state?.chosenTreatment || localStorage.getItem('selectedTreatment') || '';
  const selectedDate = location.state?.selectedDate || localStorage.getItem('selectedDate') || '';

  const validateIsraeliId = (id) => {
    if (!id) return true;
    return /^\d{9}$/.test(id);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleLogin = async () => {
    if (!id || !email) {
      alert('אנא מלא את כל השדות');
      return;
    }

    if (!validateIsraeliId(id)) {
      alert('תעודת זהות לא חוקית');
      return;
    }

    if (!validateEmail(email)) {
      alert('אימייל לא חוקי');
      return;
    }

    try {
      // ** שינוי כאן: העברת ה-id כמחרוזת
      // בדיקה אם זה מנהל לפי הפרטים
      const isAdminCredentials = id === '214927790' && email.toLowerCase() === 'avigail7790@gmail.com';
      
      if (isAdminCredentials && !showPasswordField) {
        setShowPasswordField(true);
        alert('אנא הכנס סיסמה');
        return;
      }
      
      if (isAdminCredentials && showPasswordField) {
        if (!password) {
          alert('אנא הכנס סיסמה');
          return;
        }
        
        console.log('שולח לשרת:', { id, email: email.toLowerCase(), password });
        const admin = await checkIfAdmin(id, email.toLowerCase(), password);
        console.log('תוצאת בדיקת מנהל:', admin);
        console.log('האם יש שגיאה:', admin?.error);
        
        if (admin && !admin.error) {
          console.log('מנהל זוהה! מעביר לדף ניהול');
          localStorage.setItem('adminName', admin.fullName || admin.FullName || admin.name || 'מנהל');
          navigate('/AdminLogin', {
            state: {
              email,
              id,
              name: admin.name,
              fullName: admin.fullName || admin.FullName
            },
          });
          return;
        } else {
          alert('סיסמה שגויה');
          return;
        }
      }
      
      const found = await FindByIdAndEmail(id, email.toLowerCase());
      
      console.log('תוצאת בדיקת לקוח:', found);

      if (found.data) {
        alert(`ברוך הבא, ${found.data.email || email}!`);
        

        // שמירת שם הלקוח
        if (found.data?.firstName) {
          localStorage.setItem('customerName', found.data.firstName);
          console.log('שם לקוח נשמר:', found.data.firstName);
        }
        
        // שמירה ב-Redux
        const appointmentData = {
          customerId: id,
          email: email,
          treatment: chosenTreatment,
          scheduledTime: selectedDate
        };
        console.log('שמירת נתונים ב-Redux:', appointmentData);
        dispatch(saveAppointment(appointmentData));
        navigate('/summary', { state: { email, id, treatment: chosenTreatment, selectedDate } });
      } else if (found.error?.includes("אימייל לא תואם")) {
        alert("האימייל אינו תואם לתעודת הזהות. נסה שנית.");
      } else {
        navigate('/CustomerForm', { state: { initialId: id, initialEmail: email, treatment: chosenTreatment } });
      }
    } catch (error) {
      console.error("Login failed:", error);
      // אם יש שגיאה בבדיקת מנהל, זה לא אומר שהלוגין נכשל
      if (error.message && error.message.includes('admin')) {
        console.log('שגיאה בבדיקת מנהל - ממשיך כלקוח');
        return;
      }
      alert("התחברות נכשלה. אנא נסה שוב.");
    }
  };

  const handleGoogleSuccess = (userInfo) => {
    console.log('התחברות Google הצליחה:', userInfo);
    
    // שמירת נתוני הלקוח
    localStorage.setItem('customerName', userInfo.name);
    
    // שמירה ב-Redux
    const appointmentData = {
      customerId: userInfo.id,
      email: userInfo.email,
      treatment: chosenTreatment,
      scheduledTime: selectedDate
    };
    
    dispatch(saveAppointment(appointmentData));
    
    // מעבר לדף הסיכום
    navigate('/summary', { 
      state: { 
        email: userInfo.email, 
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        treatment: chosenTreatment, 
        selectedDate 
      } 
    });
  };
  
  const handleGoogleError = (error) => {
    console.error('שגיאה בהתחברות Google:', error);
    alert('שגיאה בהתחברות עם Google. אנא נסה שוב.');
  };

  const handleSaveAppointment = () => {
    const appointmentData = {
      customerId: id,
      email: email,
      treatment: chosenTreatment,
    };
    dispatch(saveAppointment(appointmentData));
    navigate('/summary');
  };

  if (isNewCustomer) {
    return (
      <CustomerForm
        onComplete={() =>
          navigate('/summary')
        }
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">התחברות למערכת</h2>
        <p className="login-subtitle">הכנס את פרטיך כדי להמשיך</p>
        <div className="input-group">
          <label htmlFor="id-input">מספר תעודת זהות</label>
          <input
            id="id-input"
            type="text"
            placeholder="הקלד מספר ת.ז."
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="login-input"
            dir="rtl"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email-input">דואר אלקטרוני</label>
          <input
            id="email-input"
            type="email"
            placeholder="הקלד דואר אלקטרוני"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            dir="rtl"
          />
        </div>
        
        {showPasswordField && (
          <div className="input-group">
            <label htmlFor="password-input">סיסמה (למנהל)</label>
            <input
              id="password-input"
              type="password"
              placeholder="הכנס סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              dir="rtl"
            />
          </div>
        )}
        <button onClick={handleLogin} className="login-button">
          המשך
        </button>
        
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '20px 0',
            color: '#666'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
            <span style={{ padding: '0 15px' }}>או</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          </div>
        </div>
        
        <GoogleLogin 
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>
    </div>
  );
}