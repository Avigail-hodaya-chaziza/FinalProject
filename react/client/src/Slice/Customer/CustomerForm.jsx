import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addCustomer } from '../../Services/customerApi';
import '../../css/CustomerForm.css';

function CustomerForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialName, initialEmail, treatment } = location.state || {};

  const [form, setForm] = useState({
    firstName: initialName || '',
    phoneNumber: '',
    email: initialEmail || '',
  });

  useEffect(() => {
    setForm(prevForm => ({
      ...prevForm,
      firstName: initialName || prevForm.firstName,
      email: initialEmail || prevForm.email,
    }));
  }, [initialName, initialEmail]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^05\d{8}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const { firstName, phoneNumber, email } = form;

    console.log('נתוני הטופס:', { firstName, phoneNumber, email });
    console.log('firstName length:', firstName?.length);

    if (!firstName || !phoneNumber || !email) {
      alert('אנא מלא את כל השדות');
      return;
    }

    if (!validateEmail(email)) {
      alert('אימייל לא חוקי');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      alert('מספר טלפון לא חוקי (חייב להתחיל ב-05 ולהיות 10 ספרות)');
      return;
    }

    try {
      const customerDataToSend = {
        FullName: String(form.firstName),
        PhoneNumber: String(form.phoneNumber),
        Email: String(form.email),
      };

      console.log('נתונים שנשלחים לשרת:', customerDataToSend);
      console.log('FullName:', customerDataToSend.FullName, 'Length:', customerDataToSend.FullName.length);

      await addCustomer(customerDataToSend);
      alert('לקוח נוסף בהצלחה');
      navigate('/summary', {
        state: {
          email,
          name: firstName,
          firstName,
          phoneNumber,
          treatment: treatment || 'טיפול כלשהו',
        },
      });
    } catch (err) {
      console.error('שגיאה בהוספת לקוח:', err);
      alert('אירעה שגיאה בעת הוספת הלקוח');
    }
  };

  return (
    <div className="customer-form-container">
      <div className="customer-form-box">
        <h2 className="form-title">ברוך הבא!</h2>
        <p className="form-subtitle">אנא השלם את פרטיך האישיים</p>
        <div className="input-grid">
          <div className="input-group">
            <label htmlFor="firstName">שם מלא</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="הקלד שם מלא"
              onChange={handleChange}
              value={form.firstName}
              disabled={!!initialName}
              className="form-input"
              dir="rtl"
            />
          </div>
          <div className="input-group">
            <label htmlFor="phoneNumber">טלפון</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="05XXXXXXXX"
              onChange={handleChange}
              value={form.phoneNumber}
              className="form-input"
              dir="rtl"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">דואר אלקטרוני</label>
            <input
              id="email"
              name="email"
              placeholder="הקלד דואר אלקטרוני"
              onChange={handleChange}
              value={form.email}
              disabled={!!initialEmail}
              className="form-input"
              dir="rtl"
            />
          </div>
        </div>
        <button onClick={handleSubmit} className="form-button">שמור</button>
      </div>
    </div>
  );
}

export default CustomerForm;