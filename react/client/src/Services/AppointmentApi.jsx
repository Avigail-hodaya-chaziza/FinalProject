import api from './api';

export const saveAppointment = async (appointmentData) => {
  try {
    console.log('שליחת תור:', appointmentData);
    const response = await api.post('/Appointment/AddAppointment', appointmentData);
    if (response.status === 200) {
      console.log('תור נשמר בהצלחה!');
      alert("נשמר בהצלחה!");
      return response.data;
    }
  } catch (error) {
    console.error("שגיאה בשמירת התור:", error.response?.data || error.message);
    alert("אירעה שגיאה בשמירת התור.");
    throw error;
  }
};

export const deleteAppointment = async (date) => {
  try {
    const response = await api.delete('/Appointment/DeleteAppointment', { data: date });
    if (response.status === 200) {
      alert('תור נמחק בהצלחה!');
      return response.data;
    }
  } catch (error) {
    console.error('שגיאה במחיקת התור:', error);
    alert('שגיאה במחיקת התור');
    throw error;
  }
};

export const updateAppointment = async (appointmentData) => {
  try {
    const response = await api.put('/Appointment/UpdateAppointment', appointmentData);
    if (response.status === 200) {
      alert('תור עודכן בהצלחה!');
      return response.data;
    }
  } catch (error) {
    console.error('שגיאה בעדכון התור:', error);
    alert('שגיאה בעדכון התור');
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await api.get('/Appointment/GetAllAppointments');
    return response.data;
  } catch (error) {
    console.error('שגיאה בקבלת תורים:', error);
    throw error;
  }
};