import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerForm from '../Slice/Customer/CustomerForm';
import { FindByIdAndEmail, FindByNameAndEmail } from '../Services/customerApi';
import { checkIfAdmin } from '../Services/adminApi';
import { useDispatch } from 'react-redux';
import { saveAppointment } from '../Slice/Appointment/AppointmentSlice';
import GoogleLogin from '../Components/GoogleLogin';
import '../css/login.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const chosenTreatment = location.state?.chosenTreatment || localStorage.getItem('selectedTreatment') || '';
  const selectedDate = location.state?.selectedDate || localStorage.getItem('selectedDate') || '';
  
  // ניקוי תאריך ישן כשנכנסים לדף התחברות
  useEffect(() => {
    if (!location.state?.selectedDate) {
      localStorage.removeItem('selectedDate');
      localStorage.removeItem('selectedTreatment');
    }
  }, []);

  const validateName = (name) => {
    if (!name) return false;
    return name.trim().length >= 2;
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleLogin = async () => {
    if (!name || !email) {
      alert('אנא מלא את כל השדות');
      return;
    }

    if (!validateName(name)) {
      alert('אנא הכנס שם תקין (לפחות 2 אותיות)');
      return;
    }

    if (!validateEmail(email)) {
      alert('אימייל לא חוקי');
      return;
    }

    try {
      // בדיקה אם זה מנהל לפי הפרטים
      const isAdminCredentials = name === 'אביגיל' && email.toLowerCase() === 'avigail7790@gmail.com';
      
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
        
        console.log('שולח לשרת:', { name, email: email.toLowerCase(), password });
        const admin = await checkIfAdmin(name, email.toLowerCase(), password);
        console.log('תוצאת בדיקת מנהל:', admin);
        console.log('האם יש שגיאה:', admin?.error);
        
        if (admin && !admin.error) {
          console.log('מנהל זוהה! מעביר לדף ניהול');
          localStorage.setItem('adminName', admin.fullName || admin.FullName || admin.name || 'מנהל');
          navigate('/AdminLogin', {
            state: {
              email,
              name,
              adminName: admin.name,
              fullName: admin.fullName || admin.FullName
            },
          });
          return;
        } else {
          alert('סיסמה שגויה');
          return;
        }
      }
      
      const found = await FindByIdAndEmail(name, email.toLowerCase());
      
      console.log('תוצאת בדיקת לקוח:', found);

      if (found.data) {
        alert(`ברוך הבא, ${found.data.email || email}!`);
        

        // עדכון נתוני הלקוח מההתחברות הרגילה
        const fullName = found.data?.firstName && found.data?.lastName 
          ? `${found.data.firstName} ${found.data.lastName}` 
          : name;
          
        localStorage.setItem('customerName', fullName);
        localStorage.setItem('customerFirstName', found.data?.firstName || name);
        localStorage.setItem('customerLastName', found.data?.lastName || '');
        localStorage.setItem('customerPhone', found.data?.phoneNumber || '');
        localStorage.setItem('customerEmail', email);
        localStorage.setItem('customerId', found.data?.customerId || name);
        localStorage.setItem('loginMethod', 'regular');
        
        console.log('נתוני לקוח עודכנו:', {
          name: fullName,
          email: email,
          phone: found.data?.phoneNumber
        });
        
        // שמירה ב-Redux
        const appointmentData = {
          customerId: found.data?.customerId || name,
          email: email,
          treatment: chosenTreatment,
          scheduledTime: selectedDate
        };
        console.log('שמירת נתונים ב-Redux:', appointmentData);
        dispatch(saveAppointment(appointmentData));
        navigate('/summary', { state: { email, name, treatment: chosenTreatment, selectedDate } });
      } else if (found.error?.includes("אימייל לא תואם")) {
        alert("האימייל אינו תואם לתעודת הזהות. נסה שנית.");
      } else {
        navigate('/CustomerForm', { state: { initialName: name, initialEmail: email, treatment: chosenTreatment } });
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
    // בדיקה מה יש שמור
    console.log('כל ה-localStorage:', {
      customerName: localStorage.getItem('customerName'),
      customerPhone: localStorage.getItem('customerPhone'),
      customerFirstName: localStorage.getItem('customerFirstName'),
      customerLastName: localStorage.getItem('customerLastName')
    });
    
    const savedName = localStorage.getItem('customerName');
    const savedPhone = localStorage.getItem('customerPhone');
    
    console.log('נתונים שמורים:', { savedName, savedPhone, googleName: userInfo.name });
    
    const fullName = userInfo.name || savedName || prompt('אנא הכנס את שמך המלא:');
    const phoneNumber = savedPhone || prompt('אנא הכנס מספר טלפון:');
    
    if (!fullName || !phoneNumber) return;
    
    const [firstName, ...lastNameParts] = fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ');
    
    console.log('מעבד נתונים...', { fullName, firstName, lastName, phoneNumber });
    
    // שמירת נתונים
    localStorage.setItem('customerName', fullName);
    localStorage.setItem('customerPhone', phoneNumber);
    localStorage.setItem('customerFirstName', firstName);
    localStorage.setItem('customerLastName', lastName);
    localStorage.setItem('customerEmail', userInfo.email);
    localStorage.setItem('customerId', userInfo.id);
    
    console.log('נתונים נשמרו:', {
      fullName, firstName, lastName, phoneNumber, email: userInfo.email
    });
    
    // Redux
    dispatch(saveAppointment({
      customerId: userInfo.id,
      email: userInfo.email,
      treatment: chosenTreatment,
      scheduledTime: selectedDate
    }));
    
    console.log('עובר לדף סיכום...');
    
    // מעבר לדף הסיכום
    navigate('/summary', { 
      state: { 
        email: userInfo.email, 
        id: userInfo.id,
        firstName,
        lastName,
        phoneNumber,
        treatment: chosenTreatment, 
        selectedDate 
      } 
    });
    
    setIsProcessingGoogle(false);
  };
  
  const handleGoogleError = (error) => {
    console.error('שגיאה בהתחברות Google:', error);
    alert('שגיאה בהתחברות עם Google. אנא נסה שוב.');
  };

  const handleSaveAppointment = () => {
    const appointmentData = {
      customerId: name,
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
          <label htmlFor="name-input">שם מלא</label>
          <input
            id="name-input"
            type="text"
            placeholder="הקלד שם מלא"
            value={name}
            onChange={(e) => setName(e.target.value)}
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