import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTreatment } from '../Slice/Treatment/treatmentsSlice';

import '../css/treatments.css';

const AddTreatmentForm = () => {
  const [form, setForm] = useState({
    treatmentName: '',
    description: ' ', 
    timeOfCare: '',
    minPrice: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // בדיקת שדות חובה
    if (!form.treatmentName || !form.timeOfCare || !form.minPrice) {
      alert('אנא מלא את כל השדות החובה');
      return;
    }
    
    // המרת נתונים לשמירה
    const treatmentData = {
      treatmentName: form.treatmentName,
      description: form.description,
      timeOfCare: parseInt(form.timeOfCare) || 0,
      minPrice: parseFloat(form.minPrice) || 0
    };
    
    console.log('שליחת טיפול:', treatmentData);
    
    try {
      const result = await dispatch(addTreatment(treatmentData));
      console.log('תוצאת הוספת טיפול:', result);
      
      if (result.type === 'treatments/addTreatment/fulfilled') {
        alert('טיפול נוסף בהצלחה!');
        setForm({ treatmentName: '', description: '', timeOfCare: '', minPrice: '' });
      } else {
        console.error('שגיאה בהוספת טיפול:', result.payload);
        alert('שגיאה בהוספת טיפול: ' + (result.payload || 'שגיאה לא ידועה'));
      }
    } catch (error) {
      console.error('שגיאה:', error);
      alert('שגיאה בהוספת טיפול');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <form className="treatment-form" onSubmit={handleSubmit}>
      <h2>➕ הוספת טיפול חדש</h2>
      <input
        className="form-input"
        placeholder="שם טיפול"
        value={form.treatmentName}
        onChange={(e) => setForm({ ...form, treatmentName: e.target.value })}
      />
      <textarea
        className="form-textarea" // הוספת מחלקה חדשה לעיצוב
        placeholder="פירוט הטיפול"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        className="form-input"
        placeholder="משך טיפול (בדקות)"
        value={form.timeOfCare}
        onChange={(e) => setForm({ ...form, timeOfCare: e.target.value })}
      />

      <input
        className="form-input"
        placeholder="מחיר מינימלי"
        value={form.minPrice}
        onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
      />
      <button className="btn-save" type="submit">שמור</button>
      <button className="btn-go-back" type="button" onClick={handleGoBack}>חזור</button>
    </form>
  );
};

export default AddTreatmentForm;