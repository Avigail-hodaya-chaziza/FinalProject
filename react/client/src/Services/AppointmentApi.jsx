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
