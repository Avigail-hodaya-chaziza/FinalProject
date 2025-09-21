import React, { useState, useEffect } from 'react';
import { addBlockedDate, getBlockedDates, isDateAvailable, testApiConnection } from '../../Services/blockedSlotApi';

function BlockedDateForm() {
  const [blockedDates, setBlockedDates] = useState([]);
  const [form, setForm] = useState({ date: '', holidayName: '' });
  const [dateToCheck, setDateToCheck] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [apiTestResult, setApiTestResult] = useState(null);

  useEffect(() => {
    getBlockedDates()
      .then(setBlockedDates)
      .catch((err) => console.error("שגיאה בשליפת תאריכים:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { date, holidayName } = form;
    if (!date || !holidayName) {
      alert("אנא מלא את כל השדות");
      return;
    }

    try {
      await addBlockedDate({ date, holidayName });
      alert("תאריך נחסם בהצלחה");
      setBlockedDates((prev) => [...prev, date]);
    } catch (err) {
      alert("שגיאה בחסימת תאריך");
      console.error(err);
    }
  };

  const handleCheckDate = async () => {
    try {
      const result = await isDateAvailable(dateToCheck);
      setCheckResult(result);
    } catch (err) {
      console.error("שגיאה בבדיקת תאריך", err);
    }
  };

  const handleTestApi = async () => {
    try {
      const result = await testApiConnection();
      setApiTestResult(result);
    } catch (err) {
      setApiTestResult({ Success: false, Message: err.message });
      console.error("שגיאה בבדיקת API", err);
    }
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <h2>⛔ הוספת תאריך חסום</h2>
      <input name="date" type="date" onChange={handleChange} placeholder="תאריך" />
      <input name="holidayName" onChange={handleChange} placeholder="שם החג/אירוע" />
      <button onClick={handleSubmit}>שמור</button>

      <hr />

      <h3>📅 </h3>
      <ul>
        {blockedDates.map((d, i) => <li key={i}>{d}</li>)}
      </ul>

      <hr />

      <h3>🔍 בדיקת תאריך פנוי</h3>
      <input type="date" value={dateToCheck} onChange={e => setDateToCheck(e.target.value)} />
      <button onClick={handleCheckDate}>בדוק</button>
      {checkResult !== null && (
        <p>{checkResult ? "✅ התאריך פנוי" : "❌ התאריך חסום"}</p>
      )}

      <hr />

      <h3>🔍 בדיקת חיבור API חיצוני</h3>
      <button onClick={handleTestApi}>בדוק חיבור API</button>
      {apiTestResult && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: apiTestResult.Success ? '#d4edda' : '#f8d7da', border: '1px solid', borderColor: apiTestResult.Success ? '#c3e6cb' : '#f5c6cb', borderRadius: '5px' }}>
          <p><strong>סטטוס:</strong> {apiTestResult.Success ? '✅ הצלחה' : '❌ כשלון'}</p>
          <p><strong>הודעה:</strong> {apiTestResult.Message}</p>
          {apiTestResult.DatesCount !== undefined && (
            <p><strong>מספר תאריכים:</strong> {apiTestResult.DatesCount}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BlockedDateForm;
