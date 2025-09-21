// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import customersSlice from '../Slice/Customer/customersSlice'; 
import treatmentsReducer from '../Slice/Treatment/treatmentsSlice';
import authReducer from '../Slice/auth/authSlice';
import appointmentReducer from '../Slice/Appointment/AppointmentSlice';

const store = configureStore({
  reducer: {
    customers: customersSlice,
    treatments: treatmentsReducer,
    auth: authReducer,
    appointment: appointmentReducer,
 

  },
});

export default store;
