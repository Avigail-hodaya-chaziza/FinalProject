import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomers } from '../Slice/Customer/customersSlice';
import { fetchTreatments } from '../Slice/Treatment/treatmentsSlice';
import { saveAppointment } from '../Services/AppointmentApi';
import { sendAppointmentEmail } from '../Services/emailService';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [appointmentSaved, setAppointmentSaved] = useState(false);

  // קבל נתונים מ-navigate state ו-Redux
  const { email, id, firstName, lastName, phoneNumber, treatment: treatmentName } = location.state || {};
  
  // שמירת נתונים ב-localStorage לחזרה מדף BAY
  useEffect(() => {
    if (email) localStorage.setItem('customerEmail', email);
    if (id) localStorage.setItem('customerId', id);
    if (firstName) localStorage.setItem('customerFirstName', firstName);
    if (lastName) localStorage.setItem('customerLastName', lastName);
    if (phoneNumber) localStorage.setItem('customerPhone', phoneNumber);
    
    // בדיקה אם התור כבר נשמר
    const saved = localStorage.getItem('appointmentSaved');
    if (saved === 'true') {
      setAppointmentSaved(true);
    }
  }, [email, id, firstName, lastName, phoneNumber]);
  
  const customerId = useSelector((state) => state.appointment.customerId) || id;
  const treatmentId = useSelector((state) => state.appointment.treatmentId);
  const scheduledTime = useSelector((state) => state.appointment.scheduledTime);
  const treatmentFromRedux = useSelector((state) => state.appointment.treatmentName);
  
  // או מ-localStorage
  const savedTreatment = localStorage.getItem('selectedTreatment');
  const savedDate = localStorage.getItem('selectedDate');
  
  const finalTreatment = treatmentFromRedux || treatmentName || savedTreatment;
  const finalDate = scheduledTime || savedDate;

  const customers = useSelector((state) => state.customers.customers);
  const treatments = useSelector((state) => state.treatments.treatments);

  const isCustomersLoading = useSelector(state => state.customers.loading);
  const isTreatmentsLoading = useSelector(state => state.treatments.loading);

  useEffect(() => {
    // טען טיפולים בלבד
    if (!treatments || treatments.length === 0) {
      dispatch(fetchTreatments());
    }
  }, [dispatch, treatments]);

  const customer = customers?.find((c) => c.id === customerId || c.customerId === customerId);
  const treatment = treatments?.find((t) => t.id === treatmentId || t.treatmentId === treatmentId);

  // דיבאג - בדוק מה חסר
  console.log('Debug Summary Page:', {
    customerId,
    treatmentId, 
    scheduledTime,
    customer,
    treatment: treatment || treatments?.find(t => t.name === treatmentName),
    locationState: location.state,
    allCustomers: customers,
    allTreatments: treatments,
    isCustomersLoading,
    isTreatmentsLoading
  });
  
  console.log('Redux appointment state:', useSelector(state => state.appointment));
  console.log('Redux customers state:', useSelector(state => state.customers));
  console.log('Redux treatments state:', useSelector(state => state.treatments));

  if (isCustomersLoading || isTreatmentsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
        <p>טוען נתונים...</p>
      </Box>
    );
  }

  // אם יש נתונים, הצג אותם
  if (customerId || email) {
    // קבלת נתונים מ-localStorage אם לא עוברים ב-state
    const savedFirstName = firstName || localStorage.getItem('customerFirstName');
    const savedLastName = lastName || localStorage.getItem('customerLastName');
    const savedEmail = email || localStorage.getItem('customerEmail');
    const savedPhone = phoneNumber || localStorage.getItem('customerPhone');
    
    const customerName = (savedFirstName && savedLastName) 
      ? `${savedFirstName} ${savedLastName}`
      : (customer?.firstName && customer?.lastName) 
        ? `${customer.firstName} ${customer.lastName}`
        : customer?.firstName || customer?.name || (savedEmail ? savedEmail.split('@')[0] : 'לקוח יקר');
    
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        direction: 'rtl'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '30px'
          }}>
            סיכום הזמנה ✨
          </div>
          
          <div style={{
            display: 'grid',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <span style={{fontWeight: 'bold', color: '#667eea'}}>👤 שם:</span>
              <span style={{color: '#333'}}>{customerName}</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: 'rgba(118, 75, 162, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(118, 75, 162, 0.2)'
            }}>
              <span style={{fontWeight: 'bold', color: '#764ba2'}}>📧 אימייל:</span>
              <span style={{color: '#333'}}>{savedEmail || 'לא נמצא'}</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <span style={{fontWeight: 'bold', color: '#667eea'}}>📱 טלפון:</span>
              <span style={{color: '#333'}}>{savedPhone || customer?.phoneNumber || 'לא נמצא'}</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: 'rgba(118, 75, 162, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(118, 75, 162, 0.2)'
            }}>
              <span style={{fontWeight: 'bold', color: '#764ba2'}}>💆 טיפול:</span>
              <span style={{color: '#333'}}>{finalTreatment || 'לא נבחר'}</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <span style={{fontWeight: 'bold', color: '#667eea'}}>📅 תאריך:</span>
              <span style={{color: '#333'}}>{finalDate || 'לא נבחר'}</span>
            </div>
          </div>
        
        <button onClick={async () => {
          try {
            // שמירת התור בשרת
            const appointmentData = {
              CustomerId: customerId || id,
              ScheduledTime: finalDate,
              TreatmentId: treatmentId || 1 // אם אין treatmentId, שים 1 כברירת מחדל
            };
            
            console.log('שמירת תור:', appointmentData);
            await saveAppointment(appointmentData);
            
            const summary = {
              customerName,
              email: email || 'לא נמצא',
              phone: phoneNumber || customer?.phoneNumber || 'לא נמצא',
              treatment: finalTreatment || 'לא נבחר',
              date: finalDate || 'לא נבחר'
            };
            console.log('שליחת סיכום למנהלת:', summary);
            
            // שליחת מייל
            const emailResult = await sendAppointmentEmail(summary);
            
            if (emailResult.success) {
              alert("התור נשמר בהצלחה והפרטים נשלחו למייל!");
            } else {
              alert("התור נשמר בהצלחה אך הייתה בעיה בשליחת המייל.");
            }
            
            // סימון שהתור נשמר
            localStorage.setItem('appointmentSaved', 'true');
            setAppointmentSaved(true);
            
            // מעבר אוטומטי לדף הסיום עם השם
            navigate('/bay', { 
              state: { 
                firstName, 
                lastName, 
                customerName,
                email,
                phoneNumber
              } 
            });
          } catch (error) {
            console.error('שגיאה בשמירת התור:', error);
            alert('שגיאה בשמירת התור');
          }
        }} style={{
          display: appointmentSaved ? 'none' : 'block',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '25px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
        }}>
          שמור תור ✨
        </button>
        
        {appointmentSaved && (
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            marginTop: '20px',
            boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
          }}>
            נעמוד איתך בקשר! 📞✨
          </div>
        )}
        </div>
      </div>
    );
  }

  if (!customer || !treatment || !scheduledTime) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h3>חסרים נתונים</h3>
        <p>customerId: {customerId || 'חסר'}</p>
        <p>treatmentId: {treatmentId || 'חסר'}</p>
        <p>scheduledTime: {scheduledTime || 'חסר'}</p>
        <button onClick={() => navigate('/bay')}>חזר לדף הראשי</button>
      </div>
    );
  }

  const handleSendToManager = () => {
    const summary = {
      customer: customer.name,
      email: customer.email,
      treatment: treatment.name,
      time: scheduledTime,
    };
    console.log(summary);
    alert("הפרטים נשלחו למנהלת!");
  };

  return (
    <div>
      <h2>סיכום הזמנה</h2>
      <p>שם: {customer.name}</p>
      <p>אימייל: {customer.email}</p>
      <p>טיפול: {treatment.name}</p>
      <p>זמן: {scheduledTime}</p>

      <button onClick={handleSendToManager}>שלח למנהלת</button>
      <button onClick={() => navigate('/bay')}>לסיום</button>
    </div>
  );
};

export default SummaryPage;
