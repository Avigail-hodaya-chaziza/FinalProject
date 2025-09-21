import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addCustomer } from '../../Services/customerApi';
import '../../css/CustomerForm.css'; // ייבוא קובץ ה-CSS

function CustomerForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialId, initialEmail, treatment } = location.state || {};

  const [form, setForm] = useState({
    customerId: initialId || '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: initialEmail || '',
  });

  useEffect(() => {
    setForm(prevForm => ({
      ...prevForm,
      customerId: initialId || prevForm.customerId,
      email: initialEmail || prevForm.email,
    }));
  }, [initialId, initialEmail]);

  const validateIsraeliId = (id) => /^\d{9}$/.test(id);
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
    const { customerId, firstName, lastName, phoneNumber, email } = form;

    if (!customerId || !firstName || !lastName || !phoneNumber || !email) {
      alert('אנא מלא את כל השדות');
      return;
    }

    if (!validateIsraeliId(String(customerId))) {
     alert('תעודת זהות לא חוקית (9 ספרות)');
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
     // ** שינוי חשוב כאן! נבנה אובייקט חדש ששולח את הכל כמחרוזות.
    const customerDataToSend = {
     customerId: String(form.customerId),
 firstName: String(form.firstName),
     lastName: String(form.lastName),
     phoneNumber: String(form.phoneNumber),
     email: String(form.email),
     };

     await addCustomer(customerDataToSend);
     alert('לקוח נוסף בהצלחה');
     navigate('/summary', {
    state: {
     email,
     id: customerId,
     firstName,
     lastName,
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
            <label htmlFor="customerId">מספר תעודת זהות</label>
            <input
              id="customerId"
              name="customerId"
              placeholder="הקלד מספר ת.ז."
              onChange={handleChange}
              value={form.customerId}
              disabled={!!initialId}
              className="form-input"
              dir="rtl"
            />
          </div>
          <div className="input-group">
            <label htmlFor="firstName">שם פרטי</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="הקלד שם פרטי"
              onChange={handleChange}
              value={form.firstName}
              className="form-input"
              dir="rtl"
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">שם משפחה</label>
            <input
              id="lastName"
              name="lastName"
              placeholder="הקלד שם משפחה"
              onChange={handleChange}
              value={form.lastName}
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