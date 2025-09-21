import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import '../css/CustomerContacts.css';

const CustomerContacts = () => {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // טעינת כל הנתונים במקביל
      const [appointmentsRes, customersRes, treatmentsRes] = await Promise.all([
        api.get('/Appointment/GetAllAppointments'),
        api.get('/Customer/GetAllCustomers'),
        api.get('/Treatment/GetAllTreatments')
      ]);

      setAppointments(appointmentsRes.data || []);
      setCustomers(customersRes.data || []);
      setTreatments(treatmentsRes.data || []);
    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
      alert('שגיאה בטעינת נתונים');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerAppointments = (customerId) => {
    return appointments.filter(apt => apt.customerId === customerId);
  };

  const getTreatmentName = (treatmentId) => {
    const treatment = treatments.find(t => t.id === treatmentId);
    return treatment ? treatment.treatmentName : 'לא נמצא';
  };

  const handleContactCustomer = (customer) => {
    setSelectedCustomer(customer);
    setContactMessage(`שלום ${customer.firstName || customer.name},\n\nאנו רוצים ליצור איתך קשר בנוגע לטיפולים שלך.\n\nבברכה,\nצוות המכון`);
  };

  const sendMessage = () => {
    if (!selectedCustomer || !contactMessage.trim()) {
      alert('אנא בחר לקוח וכתוב הודעה');
      return;
    }

    // כאן תוכל להוסיף שליחת אימייל או SMS
    console.log('שליחת הודעה ללקוח:', {
      customer: selectedCustomer,
      message: contactMessage
    });
    
    alert(`הודעה נשלחה ללקוח ${selectedCustomer.firstName || selectedCustomer.name}`);
    setSelectedCustomer(null);
    setContactMessage('');
  };

  if (loading) {
    return (
      <div className="contacts-container">
        <div className="loading">
          <h3>טוען נתונים...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h2>יצירת קשר עם לקוחות</h2>
        <button onClick={() => navigate('/AdminLogin')} className="btn-back">
          חזור לניהול
        </button>
      </div>

      <div className="customers-list">
        <h3>רשימת לקוחות ({customers.length})</h3>
        
        {customers.length === 0 ? (
          <p>אין לקוחות במערכת</p>
        ) : (
          <div className="customers-grid">
            {customers.map(customer => {
              const customerAppointments = getCustomerAppointments(customer.customerId || customer.id);
              
              return (
                <div key={customer.customerId || customer.id} className="customer-card">
                  <div className="customer-info">
                    <h4>{customer.firstName || customer.name} {customer.lastName || ''}</h4>
                    <p>📧 {customer.email}</p>
                    <p>📱 {customer.phoneNumber || 'לא צוין'}</p>
                    <p>🆔 {customer.customerId || customer.id}</p>
                  </div>
                  
                  <div className="appointments-info">
                    <h5>תורים ({customerAppointments.length}):</h5>
                    {customerAppointments.length === 0 ? (
                      <p className="no-appointments">אין תורים</p>
                    ) : (
                      <ul className="appointments-list">
                        {customerAppointments.map((apt, index) => (
                          <li key={index} className="appointment-item">
                            <span className="appointment-date">
                              📅 {new Date(apt.scheduledTime).toLocaleDateString('he-IL')}
                            </span>
                            <span className="appointment-treatment">
                              💆 {getTreatmentName(apt.treatmentId)}
                            </span>
                            <span className="appointment-status">
                              📊 {apt.status || 'מתוכנן'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="customer-actions">
                    <button 
                      onClick={() => handleContactCustomer(customer)}
                      className="btn-contact"
                    >
                      צור קשר
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* חלון יצירת קשר */}
      {selectedCustomer && (
        <div className="contact-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>יצירת קשר עם {selectedCustomer.firstName || selectedCustomer.name}</h3>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="btn-close"
              >
                ✕
              </button>
            </div>
            
            <div className="customer-details">
              <p><strong>אימייל:</strong> {selectedCustomer.email}</p>
              <p><strong>טלפון:</strong> {selectedCustomer.phoneNumber || 'לא צוין'}</p>
              
              <div className="customer-appointments">
                <strong>תורים של הלקוח:</strong>
                {getCustomerAppointments(selectedCustomer.customerId || selectedCustomer.id).map((apt, index) => (
                  <div key={index} className="appointment-summary">
                    📅 {new Date(apt.scheduledTime).toLocaleDateString('he-IL')} - 
                    💆 {getTreatmentName(apt.treatmentId)}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="message-section">
              <label htmlFor="message">הודעה:</label>
              <textarea
                id="message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows="6"
                placeholder="כתוב כאן את ההודעה ללקוח..."
              />
            </div>
            
            <div className="modal-actions">
              <button onClick={sendMessage} className="btn-send">
                שלח הודעה
              </button>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="btn-cancel"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerContacts;