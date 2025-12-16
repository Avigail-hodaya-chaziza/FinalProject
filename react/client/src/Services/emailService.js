import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_6o1ytua';
const TEMPLATE_ID = 'template_dhy2bfh';
const PUBLIC_KEY = 'GO7eErTz_TGC4PgpJ';

export const sendAppointmentEmail = async (appointmentData) => {
  try {
    const templateParams = {
      to_email: 'avigail7790@gmail.com', // המייל שלך
      customer_name: appointmentData.customer_Name,
      customer_email: appointmentData.customer_email,
      customer_phone: appointmentData.customer_phone,
      treatment: appointmentData.treatment,
      appointment_date: appointmentData.appointment_date,
      message: `
        פרטי התור החדש:
        שם: ${appointmentData.customer_Name}
        אימייל: ${appointmentData.customer_email}
        טלפון: ${appointmentData.customer_phone}
        טיפול: ${appointmentData.treatment}
        תאריך: ${appointmentData.appointment_date}
      `
    };

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