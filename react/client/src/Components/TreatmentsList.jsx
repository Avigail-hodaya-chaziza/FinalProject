import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTreatments, removeTreatment } from '../Slice/Treatment/treatmentsSlice';
import { useNavigate, useLocation } from 'react-router-dom';

import '../css/treatments.css';

function TreatmentsList() {
  const treatments = useSelector((state) => state.treatments.list);
  const loading = useSelector((state) => state.treatments.loading);
  const error = useSelector((state) => state.treatments.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = new URLSearchParams(location.search).get('mode') === 'edit';

  useEffect(() => {
    dispatch(fetchTreatments());
  }, [dispatch]);

  // const handleDelete = (id) => {
  //   dispatch(removeTreatment(id));
  // };

  // העבר את הפונקציה לכאן
  const handleSelect = (treatment) => {
    if (isEditMode) {
      // מצב עריכה - עבור לדף עריכת טיפול
      navigate(`/UpdateTreatment/${treatment.id}`, { state: { treatment } });
    } else {
      // מצב רגיל - בחירת טיפול
      dispatch({
        type: 'appointment/setTreatment',
        payload: {
          treatmentId: treatment.id,
          treatmentName: treatment.treatmentName
        }
      });
      
      const treatmentName = treatment.treatmentName || treatment.TreatmentName;
      localStorage.setItem('selectedTreatment', treatmentName);
      console.log('טיפול נבחר:', treatmentName);
      console.log('טיפול מלא:', treatment);
      navigate('/calendar', { state: { chosenTreatment: treatmentName } });
    }
  };

  if (loading) {
    return (
      <div className="treatments-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2em', marginBottom: '20px' }}>🔄</div>
        <h3>טוען טיפולים...</h3>
        <p>אנא המתן</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="treatments-container" style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2em', marginBottom: '20px', color: 'red' }}>⚠️</div>
        <h3>שגיאה בטעינת טיפולים</h3>
        <p>{error}</p>
        <button 
          onClick={() => dispatch(fetchTreatments())}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          נסה שוב
        </button>
      </div>
    );
  }

  return (
    <div className="treatments-container">
      <h2 className="treatments-title">{isEditMode ? 'בחרי טיפול לעריכה' : 'בחרי טיפול'}</h2>
      <div className="treatments-grid">
        {Array.isArray(treatments) && treatments.length > 0 ? (
          treatments.map((t) => (
            <div key={t.TreatmentId || t.id} className="treatment-card">
              <h3 className="treatment-name">{t.TreatmentName || t.treatmentName}</h3>
              <p className="treatment-info">⏱ משך: {t.TimeOfCare || t.timeOfCare} דקות</p>
              <p className="treatment-info">💰 מחיר מינימלי: ₪{t.MinPrice || t.minPrice}</p>
              <p className="treatment-description">{t.Description || t.description}</p>
              <div className="treatment-actions">
                <button className="btn-select" onClick={() => handleSelect(t)}>{isEditMode ? 'ערוך' : 'בחרי'}</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-treatments">אין טיפולים להצגה.</p>
        )}
      </div>
    </div>
  );
}

export default TreatmentsList;