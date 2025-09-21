// appointmentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerId: null,
  treatmentId: null,
  treatmentName: null,
  scheduledTime: null,
  email: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    setTreatmentId: (state, action) => {
      state.treatmentId = action.payload;
    },
    setScheduledTime: (state, action) => {
      state.scheduledTime = action.payload;
    },
    saveAppointment: (state, action) => {
      const { customerId, email, treatment, scheduledTime, treatmentId } = action.payload;
      state.customerId = customerId;
      state.email = email;
      state.treatmentName = treatment;
      state.scheduledTime = scheduledTime;
      state.treatmentId = treatmentId;
    },
    setTreatment: (state, action) => {
      state.treatmentId = action.payload.treatmentId;
      state.treatmentName = action.payload.treatmentName;
    },
    clearAppointment: () => initialState,
  },
});

export const { setCustomerId, setTreatmentId, setScheduledTime, clearAppointment, saveAppointment, setTreatment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
