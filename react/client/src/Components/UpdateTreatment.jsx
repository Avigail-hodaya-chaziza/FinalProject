import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { UpdateTreatment as updateTreatmentAction } from '../Slice/Treatment/treatmentsSlice';
import '../css/treatments.css';

const UpdateTreatment = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { treatmentToUpdate } = location.state || {};

  const [form, setForm] = useState({
    treatmentId: treatmentToUpdate?.treatmentId || '',
    treatmentName: treatmentToUpdate?.treatmentName || '',
    description: treatmentToUpdate?.description || '',
    timeOfCare: treatmentToUpdate?.timeOfCare || '',
    minPrice: treatmentToUpdate?.minPrice || ''
  });

  useEffect(() => {
    if (!treatmentToUpdate) {
      // חזור אם אין טיפול לעדכן
      navigate('/treatments');
    }
  }, [treatmentToUpdate, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTreatmentAction(form));
    navigate('/treatments');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <form className="treatment-form" onSubmit={handleSubmit}>
      <h2>✏️ עדכון טיפול</h2>
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
      <button className="btn-save" type="submit">שמור שינויים</button>
      <button className="btn-go-back" type="button" onClick={handleGoBack}>חזור</button>
    </form>
  );
};

export default UpdateTreatment;