import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "../css/calendar.css";

function CalendarWithDisabledDates() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]); // תאריכים חסומים מהשרת
  const [isLoading, setIsLoading] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);
  const navigate = useNavigate();
  const [treatmentValue, setTreatmentValue] = useState(localStorage.getItem('selectedTreatment') || '');
  
  // קבלת הטיפול מה-URL או localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const treatmentFromUrl = urlParams.get('treatment');
    if (treatmentFromUrl) {
      setTreatmentValue(treatmentFromUrl);
      localStorage.setItem('selectedTreatment', treatmentFromUrl);
    }
  }, []);
  const dispatch = useDispatch();

  // פונקציה לטעינת תאריכים חסומים עם retry
  const fetchBlockedDates = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      console.log("🔄 מתחיל לטעון תאריכים חסומים...");
      const res = await fetch("http://localhost:5202/api/BlockedSlot/GetBlockedDates");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("📅 תאריכים חסומים מהשרת:", data);
      
      const dates = data.map(d => {
        const dateStr = d.date || d.Date;
        const convertedDate = new Date(dateStr);
        console.log(`🔄 ממיר תאריך: ${dateStr} -> ${convertedDate}`);
        return convertedDate;
      });
      
      console.log("✅ תאריכים חסומים לאחר המרה:", dates);
      console.log(`📊 סה"כ תאריכים חסומים: ${dates.length}`);
      setBlockedDates(dates);
      setApiTestResult(null);
    } catch (error) {
      console.error("❌ שגיאה בטעינת תאריכים חסומים:", error);
      
      if (retryCount < 3) {
        console.log(`🔄 ניסיון חוזר ${retryCount + 1}/3 אחרי 3 שניות...`);
        setTimeout(() => {
          fetchBlockedDates(retryCount + 1);
        }, 3000);
        return;
      }
      
      setApiTestResult({ Success: false, Message: `שגיאה: ${error.message}. לחץ 'רענן תאריכים' לניסיון חוזר` });
    } finally {
      setIsLoading(false);
    }
  };

  // טעינת תאריכים חסומים מהשרת
  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const handleSave = () => {
    if (!selectedDate) {
      alert("בחר תאריך לפני המשך");
      return;
    }

    // תיקון בעיית אזור זמן - נשתמש בתאריך המקומי
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateOnly = `${year}-${month}-${day}`;
    
    // שמירה ב-localStorage ו-Redux
    localStorage.setItem('selectedDate', dateOnly);
    
    // שמירה ב-Redux
    dispatch({
      type: 'appointment/setScheduledTime',
      payload: dateOnly
    });
    
    console.log('שמירת תאריך:', { date: dateOnly, treatment: treatmentValue });
    
    navigate('/login', { state: { chosenTreatment: treatmentValue, selectedDate: dateOnly } });
  };

  const testApiConnection = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 בודק חיבור ל-API חיצוני...");
      const res = await fetch("http://localhost:5202/api/BlockedSlot/TestApiConnection");
      const result = await res.json();
      console.log("📊 תוצאת בדיקת API:", result);
      setApiTestResult(result);
      
      if (result.Success) {
        // אם הבדיקה הצליחה, רענן את התאריכים
        await fetchBlockedDates();
      }
    } catch (error) {
      console.error("❌ שגיאה בבדיקת API:", error);
      setApiTestResult({ Success: false, Message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && blockedDates.length === 0) {
    return (
      <div className="calendar-container" style={{ direction: "rtl", textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2em', marginBottom: '20px' }}>🔄</div>
        <h3>טוען תאריכים חסומים...</h3>
        <p>אנא המתן</p>
      </div>
    );
  }

  return (
    <div className="calendar-container" style={{ direction: "rtl" }}>
      <h2 className="calendar-title">בחר תאריך</h2>
      
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          backgroundColor: 'rgba(52, 152, 219, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          🔄 מעדכן תאריכים...
        </div>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        dateFormat="dd/MM/yyyy"
        minDate={new Date()} // מונע בחירת תאריכים עבר
        // excludeDates={blockedDates}  // הוסר כי אנחנו משתמשים ב-filterDate
        filterDate={(date) => {
          // מונע בחירת שישי ושבת
          const day = date.getDay();
          const isBlocked = blockedDates.some(
            blocked => date.toDateString() === blocked.toDateString()
          );
          return day !== 5 && day !== 6 && !isBlocked;
        }}
        dayClassName={(date) => {
          const day = date.getDay();
          const isPast = date < new Date().setHours(0,0,0,0);
          const isBlocked = blockedDates.some(
            blocked => date.toDateString() === blocked.toDateString()
          );
          
          // בדיקת שבוע קרוב
          const today = new Date();
          const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          const isWithinWeek = date <= oneWeekFromNow;
          
          // כל התאריכים החסומים באפור אחיד
          if (isPast || day === 5 || day === 6 || isBlocked || isWithinWeek) {
            return "blocked-day";
          }
          return undefined;
        }}
      />
      
      {selectedDate && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <p style={{color: 'white', marginBottom: '10px'}}>
            תאריך נבחר: <strong>{selectedDate.toLocaleDateString('he-IL')}</strong>
          </p>
          {treatmentValue && (
            <p style={{color: 'white', marginBottom: '10px'}}>
              טיפול נבחר: <strong>{treatmentValue}</strong>
            </p>
          )}
        </div>
      )}

      <div className="calendar-actions">
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={!selectedDate}
          style={{
            opacity: !selectedDate ? 0.5 : 1,
            cursor: !selectedDate ? 'not-allowed' : 'pointer'
          }}
        >
          המשך להתחברות
        </button>
        <button 
          className="btn-refresh" 
          onClick={fetchBlockedDates}
          disabled={isLoading}
        >
          {isLoading ? '🔄 טוען...' : '🔄 רענן תאריכים'}
        </button>
        <button 
          className="btn-test-api" 
          onClick={testApiConnection}
          disabled={isLoading}
        >
          🔍 בדוק API חיצוני
        </button>
      </div>
      
      {/* הצגת מידע על תאריכים חסומים */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }}>
        <h4>📊 מידע על תאריכים חסומים:</h4>
        <p>🔢 סה"כ תאריכים חסומים: {blockedDates.length}</p>
        <p>🔄 סטטוס: {isLoading ? 'טוען תאריכים...' : 'מוכן'}</p>
        
        {apiTestResult && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: apiTestResult.Success ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)', 
            border: `1px solid ${apiTestResult.Success ? '#28a745' : '#dc3545'}`, 
            borderRadius: '8px' 
          }}>
            <p><strong>🔍 תוצאת בדיקת API:</strong></p>
            <p>סטטוס: {apiTestResult.Success ? '✅ הצלחה' : '❌ כשלון'}</p>
            <p>הודעה: {apiTestResult.Message}</p>
            {apiTestResult.DatesCount !== undefined && (
              <p>מספר תאריכים שנטענו: {apiTestResult.DatesCount}</p>
            )}
          </div>
        )}
        {blockedDates.length > 0 && (
          <div>
            <p>📅 התאריכים החסומים:</p>
            <ul style={{ textAlign: 'right', maxHeight: '150px', overflowY: 'auto' }}>
              {blockedDates.map((date, index) => (
                <li key={index} style={{ margin: '5px 0' }}>
                  {date.toLocaleDateString('he-IL')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarWithDisabledDates;
