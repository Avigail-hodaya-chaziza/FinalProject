import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTreatments, removeTreatment } from '../Slice/Treatment/treatmentsSlice';
import { deleteTreatment, updateTreatment } from '../Services/treatmentsApi';
import '../css/treatments.css';

const DeleteTreatment = () => {
  const dispatch = useDispatch();
  const treatments = useSelector(state => state.treatments.list || []);
  const loading = useSelector(state => state.treatments.loading);
  const treatmentsState = useSelector(state => state.treatments);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    console.log('🔍 טוען טיפולים...');
    dispatch(fetchTreatments());
  }, [dispatch]);
  


  console.log('🔍 כל הטיפולים:', treatments);
  
  const handleEdit = (treatment) => {
    console.log('📝 עריכת טיפול:', treatment);
    setEditingTreatment(treatment.TreatmentId || treatment.id);
    setEditForm({
      treatmentName: treatment.TreatmentName || '',
      description: treatment.Description || '',
      timeOfCare: treatment.TimeOfCare || 0,
      minPrice: treatment.MinPrice || 0
    });
  };
  
  const handleSaveEdit = async () => {
    try {
      console.log('שליחת עדכון טיפול:', editingTreatment, editForm);
      // פתרון זמני: מחיקה ויצירה מחדש במקום עדכון
      await deleteTreatment(editingTreatment);
      const { addTreatment } = await import('../Services/treatmentsApi');
      await addTreatment(editForm);
      dispatch(fetchTreatments());
      setEditingTreatment(null);
      alert('טיפול עודכן בהצלחה!');
    } catch (error) {
      console.error('שגיאה בעדכון טיפול:', error);
      alert('שגיאה בעדכון טיפול: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const handleDelete = async (treatmentId) => {
    console.log('🔍 מחיקת טיפול ID:', treatmentId);
    
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הטיפול?')) {
      try {
        await deleteTreatment(treatmentId);
        // רענן את הרשימה מהשרת
        dispatch(fetchTreatments());
        alert('טיפול נמחק בהצלחה!');
      } catch (error) {
        console.error('שגיאה במחיקת טיפול:', error);
        alert('שגיאה במחיקת טיפול');
      }
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>טוען טיפולים...</div>;
  }

  return (
    <div className="treatments-container">
      <h1 className="treatments-title">מחיקת ועריכת טיפולים</h1>
            
      {treatments.length === 0 ? (
        <p className="no-treatments">אין טיפולים להצגה</p>
      ) : editingTreatment ? (
        <div className="treatments-grid">
          {treatments.filter(treatment => (treatment.TreatmentId || treatment.id) === editingTreatment).map((treatment, index) => (
            <div key={treatment.TreatmentId || treatment.id || index} className="treatment-card">
              <form className="treatment-form" onSubmit={(e) => {e.preventDefault(); handleSaveEdit();}}>
                <h2>✏️ עדכון טיפול</h2>
                <input 
                  className="form-input"
                  placeholder="שם טיפול"
                  value={editForm.treatmentName} 
                  onChange={(e) => setEditForm({...editForm, treatmentName: e.target.value})}
                />
                <textarea 
                  className="form-textarea"
                  placeholder="פירוט הטיפול"
                  value={editForm.description} 
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                />
                <input 
                  className="form-input"
                  placeholder="משך טיפול (בדקות)"
                  value={editForm.timeOfCare} 
                  onChange={(e) => setEditForm({...editForm, timeOfCare: parseInt(e.target.value)})}
                />
                <input 
                  className="form-input"
                  placeholder="מחיר מינימלי"
                  value={editForm.minPrice} 
                  onChange={(e) => setEditForm({...editForm, minPrice: parseFloat(e.target.value)})}
                />
                <button className="btn-save" type="submit">שמור שינויים</button>
                <button className="btn-go-back" type="button" onClick={() => setEditingTreatment(null)}>בטל</button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div className="treatments-grid">
          {treatments.map((treatment, index) => (
            <div key={treatment.TreatmentId || treatment.id || index} className="treatment-card">
              <h3 className="treatment-name">{treatment.TreatmentName}</h3>
              <p className="treatment-info">משך: {treatment.TimeOfCare} דקות</p>
              <p className="treatment-info">מחיר: ₪{treatment.MinPrice}</p>
              {treatment.Description && <p className="treatment-description">{treatment.Description}</p>}
              
              <div className="treatment-actions">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('לחיצה על ערוך:', treatment);
                    handleEdit(treatment);
                  }}
                  className="btn-select"
                  type="button"
                >
                  ערוך
                </button>
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('לחיצה על מחק:', treatment.TreatmentId || treatment.id);
                    handleDelete(treatment.TreatmentId || treatment.id);
                  }}
                  className="btn-delete"
                  type="button"
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteTreatment;