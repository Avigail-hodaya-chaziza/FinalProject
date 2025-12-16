import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "../css/calendar.css";

function CalendarWithDisabledDates() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [treatmentValue, setTreatmentValue] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const treatmentFromUrl = urlParams.get('treatment');
    const savedTreatment = localStorage.getItem('selectedTreatment');
    const treatmentFromState = location.state?.chosenTreatment;
    
    const finalTreatment = treatmentFromState || treatmentFromUrl || savedTreatment;
    
    if (finalTreatment && finalTreatment !== 'undefined') {
      setTreatmentValue(finalTreatment);
      localStorage.setItem('selectedTreatment', finalTreatment);
    } else {
      const lastSaved = localStorage.getItem('selectedTreatment');
      if (lastSaved && lastSaved !== 'undefined') {
        setTreatmentValue(lastSaved);
      }
    }
  }, [location.state]);
  
  const dispatch = useDispatch();

  const fetchBlockedDates = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5202/api/BlockedSlot/GetBlockedDates");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      const dates = data.map(d => {
        const dateStr = d.date || d.Date;
        return new Date(dateStr);
      });
      
      setBlockedDates(dates);
    } catch (error) {
      console.error("שגיאה בטעינת תאריכים חסומים:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    try {
      const res = await fetch("http://localhost:5202/api/Appointment/GetAllAppointments");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const appointments = await res.json();
      
      const dates = appointments.map(apt => {
        const dateStr = apt.scheduledTime || apt.ScheduledTime;
        return new Date(dateStr);
      });
      
      setBookedDates(dates);
    } catch (error) {
      console.error("שגיאה בטעינת תורים:", error);
    }
  };

  const findFirstAvailableDate = () => {
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 365; i++) {
      const day = checkDate.getDay();
      const isPast = checkDate < new Date().setHours(0,0,0,0);
      const isWeekend = day === 5 || day === 6;
      const isBlocked = blockedDates.some(
        blocked => checkDate.toDateString() === blocked.toDateString()
      );
      const isBooked = bookedDates.some(
        booked => checkDate.toDateString() === booked.toDateString()
      );
      
      if (!isPast && !isWeekend && !isBlocked && !isBooked) {
        return checkDate;
      }
      
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    return null;
  };

  useEffect(() => {
    fetchBlockedDates();
    fetchBookedDates();
  }, []);
  
  useEffect(() => {
    if (blockedDates.length > 0 || bookedDates.length > 0) {
      const firstAvailable = findFirstAvailableDate();
      if (firstAvailable && !selectedDate) {
        setSelectedDate(firstAvailable);
      }
    }
  }, [blockedDates, bookedDates]);

  const handleSave = () => {
    if (!selectedDate) {
      alert("בחר תאריך לפני המשך");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateOnly = `${year}-${month}-${day}`;
    
    localStorage.setItem('selectedDate', dateOnly);
    
    dispatch({
      type: 'appointment/setScheduledTime',
      payload: dateOnly
    });
    
    navigate('/login', { state: { chosenTreatment: treatmentValue, selectedDate: dateOnly } });
  };

  if (isLoading && blockedDates.length === 0) {
    return (
      <div className="calendar-container" style={{ direction: "rtl", textAlign: 'center', padding: '50px' }}>
        <h3>טוען תאריכים חסומים...</h3>
      </div>
    );
  }

  return (
    <div className="calendar-container" style={{ direction: "rtl" }}>
      <h2 className="calendar-title">בחר תאריך</h2>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          filterDate={(date) => {
            const isPast = date < new Date().setHours(0,0,0,0);
            const isBlocked = blockedDates.some(
              blocked => date.toDateString() === blocked.toDateString()
            );
            const isBooked = bookedDates.some(
              booked => date.toDateString() === booked.toDateString()
            );
            return !isPast && !isBlocked && !isBooked;
          }}
          dayClassName={(date) => {
            const day = date.getDay();
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < new Date().setHours(0,0,0,0);
            const isBlocked = blockedDates.some(
              blocked => date.toDateString() === blocked.toDateString()
            );
            const isBooked = bookedDates.some(
              booked => date.toDateString() === booked.toDateString()
            );
            
            const firstAvailable = findFirstAvailableDate();
            const isFirstAvailable = firstAvailable && date.toDateString() === firstAvailable.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            // אם התאריך נבחר - הוא יקבל את הסגנון הנבחר אוטומטית מ-react-datepicker
            if (isSelected) {
              return "";
            }
            
            // היום הראשון הפנוי יקבל את אותו סגנון כמו ימים זמינים רגילים
            if (isFirstAvailable) {
              return "available-day";
            }
            
            if (isPast || isBlocked || isBooked) {
              return "transparent-disabled";
            }
            if (day === 5 || day === 6) {
              return "weekend-disabled";
            }
            return "available-day";
          }}
        />
      </div>
      
      {selectedDate && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <p style={{color: 'white', marginBottom: '10px'}}>
            תאריך נבחר: <strong>{selectedDate.toLocaleDateString('he-IL')}</strong>
          </p>
          <p style={{color: 'white', marginBottom: '10px'}}>
            טיפול נבחר: <strong>{decodeURIComponent(treatmentValue || 'לא נבחר')}</strong>
          </p>
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
      </div>
    </div>
  );
}

export default CalendarWithDisabledDates;