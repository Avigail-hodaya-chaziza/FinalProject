// adminApi.js
import api from './api';


export async function loginAsAdmin(id, email) {
  console.log('loginAsAdmin called with:', id, email);
  try {
    console.log('שולחת התחברות');
    const response = await api.post('/Admin/login', {
      id,
      email,
      fullName: '',
      password: ''
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data || 'שגיאה כללית' };
  }
}

export async function checkIfAdmin(id, email, password = '123456') {
  try {
    const response = await api.post('/Admin/login', { 
      id, 
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.log('שגיאת מנהל:', error.response?.data);
    // ודא שהשגיאה היא מחרוזת
    const errorMessage = typeof error.response?.data === 'string' 
      ? error.response.data 
      : error.response?.data?.message || error.message || 'אימייל או מזהה שגויים';
    return { error: errorMessage };
  }
}
