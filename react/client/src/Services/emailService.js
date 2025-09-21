import emailjs from '@emailjs/browser';

// הגדרות EmailJS - תחליפי עם הערכים שלך
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendAppointmentEmail = async (appointmentData) => {
  try {
    console.log('נתוני התור שנשלחים:', appointmentData);
    
    const templateParams = {
      to_email: 'avigail7790@gmail.com', // המייל שלך
      customer_name: appointmentData.customerName,
      customer_email: appointmentData.email,
      customer_phone: appointmentData.phone,
      treatment: appointmentData.treatment,
      appointment_date: appointmentData.date,
      message: `
        פרטי התור החדש:
        שם: ${appointmentData.customerName}
        אימייל: ${appointmentData.email}
        טלפון: ${appointmentData.phone}
        טיפול: ${appointmentData.treatment}
        תאריך: ${appointmentData.date}
      `
    };
    
    console.log('פרמטרים לEmailJS:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('מייל נשלח בהצלחה:', response);
    return { success: true, response };
  } catch (error) {
    console.error('שגיאה בשליחת מייל:', error);
    return { success: false, error };
  }
};