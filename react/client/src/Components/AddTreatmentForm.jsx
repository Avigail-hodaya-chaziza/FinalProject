import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTreatment } from '../Services/treatmentsApi.jsx';
import '../css/treatments.css';

const AddTreatmentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    treatmentName: '',
    description: '',
    timeOfCare: '',
    minPrice: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.treatmentName || !form.timeOfCare || !form.minPrice) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    try {
      const treatmentData = {
        treatmentName: form.treatmentName,
        description: form.description,
        timeOfCare: parseInt(form.timeOfCare),
        minPrice: parseFloat(form.minPrice)
      };

      await addTreatment(treatmentData);
      alert('טיפול נוסף בהצלחה!');
      navigate('/AdminLogin');
    } catch (error) {
      console.error('שגיאה בהוספת טיפול:', error);
      alert('שגיאה בהוספת טיפול');
    }
  };

  const handleGoBack = () => {
    navigate('/AdminLogin');
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
        className="form-textarea"
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
      <button className="btn-save" type="submit">הוסף טיפול</button>
      <button className="btn-go-back" type="button" onClick={handleGoBack}>חזור</button>
    </form>
  );
};

export default AddTreatmentForm;