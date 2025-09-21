
import { useState } from 'react';
import {
  getUncontactedCustomers,
  updateCustomer,
  contactCustomer,
} from '../Services/customerApi';
import api from '../Services/api';
import '../css/IsContact.css';

function IsContact() {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = async () => {
    try {
      const [customersRes, appointmentsRes, treatmentsRes] = await Promise.all([
        getUncontactedCustomers(),
        api.get('/Appointment/GetAllAppointments'),
        api.get('/Treatment/GetAllTreatments')
      ]);
      
      setCustomers(customersRes);
      setAppointments(appointmentsRes.data || []);
      setTreatments(treatmentsRes.data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
      alert('שגיאה בטעינת נתונים');
    }
  };

  const handleChange = (field, value) => {
    const updated = [...customers];
    if (updated[currentIndex]) {
      updated[currentIndex][field] = value;
      setCustomers(updated);
    }
  };

  const handleSave = async () => {
    const customer = customers[currentIndex];
    await updateCustomer(customer);
    alert('הלקוח עודכן בהצלחה');
    if (currentIndex < customers.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCustomers([]);
      setCurrentIndex(0);
      alert('אין לקוחות נוספים כרגע.');
    }
  };

  const handleContacted = async () => {
    const customer = customers[currentIndex];
    await contactCustomer(customer.customerId);
    alert('סומן שנוצר קשר');
    const updated = customers.filter((_, i) => i !== currentIndex);
    setCustomers(updated);
    if (updated.length === 0) {
      setCurrentIndex(0);
      alert('אין לקוחות נוספים כרגע.');
    }
  };

  const handleNext = () => {
    if (currentIndex < customers.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const currentCustomer = customers[currentIndex];
  
  // קבלת תורים של הלקוח הנוכחי
  const getCustomerAppointments = () => {
    if (!currentCustomer) return [];
    return appointments.filter(apt => apt.customerId === currentCustomer.customerId);
  };
  
  // קבלת שם טיפול
  const getTreatmentName = (treatmentId) => {
    const treatment = treatments.find(t => t.treatmentId === treatmentId);
    return treatment ? treatment.treatmentName : `לא נמצא (ID: ${treatmentId})`;
  };

  return (
    <div className="iscontact-container">
      <div className="iscontact-box">
        <h2 className="iscontact-title">לקוחות שטרם נוצר איתם קשר</h2>
        
        {customers.length === 0 ? (
          <div>
            <p className="no-customers-msg">
              לחץ כדי לטעון רשימת לקוחות שטרם נוצר איתם קשר.
            </p>
            <button onClick={handleClick} className="show-customers-btn">
              📋 הצג לקוחות
            </button>
          </div>
        ) : (
          <div className="customer-card">
            <button
              onClick={handlePrev}
              className="nav-btn prev-btn"
              disabled={currentIndex === 0}
            >
              &lt;
            </button>
            <div className="customer-details-wrapper">
              <div className="customer-details">
                <div className="customer-row">
                  <label>שם פרטי</label>
                  <input
                    type="text"
                    value={currentCustomer.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="שם פרטי"
                    className="customer-input"
                    dir="rtl"
                  />
                </div>
                <div className="customer-row">
                  <label>שם משפחה</label>
                  <input
                    type="text"
                    value={currentCustomer.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="שם משפחה"
                    className="customer-input"
                    dir="rtl"
                  />
                </div>
                <div className="customer-row">
                  <label>טלפון</label>
                  <input
                    type="text"
                    value={currentCustomer.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="טלפון"
                    className="customer-input"
                    dir="rtl"
                  />
                </div>
                <div className="customer-row">
                  <label>אימייל</label>
                  <input
                    type="text"
                    value={currentCustomer.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="אימייל"
                    className="customer-input"
                    dir="rtl"
                  />
                </div>
                
                {/* הצגת תורים של הלקוח */}
                <div className="customer-appointments">
                  <label>תורים:</label>
                  <div className="appointments-list">
                    {getCustomerAppointments().length === 0 ? (
                      <p className="no-appointments">אין תורים</p>
                    ) : (
                      getCustomerAppointments().map((apt, index) => (
                        <div key={index} className="appointment-item">
                          <span className="appointment-date">
                            📅 {new Date(apt.scheduledTime).toLocaleDateString('he-IL')}
                          </span>
                          <span className="appointment-treatment">
                            💆 {getTreatmentName(apt.treatmentId)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="customer-actions">
                <button onClick={handleSave} className="action-btn save-btn">
                  💾 שמור
                </button>
                <button onClick={handleContacted} className="action-btn contacted-btn">
                  ✔ יצרו קשר
                </button>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="nav-btn next-btn"
              disabled={currentIndex === customers.length - 1}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IsContact;