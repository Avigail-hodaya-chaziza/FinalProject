import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,

});

export const getAllTreatments = () => api.get('/Treatment/GetAllTreatments');
export const addTreatment = (data) => api.post('/Treatment/AddTreatment', data);
export const updateTreatment = (id, data) => api.put(`/Treatment/UpdateTreatment/${id}`, data);
export const deleteTreatment = (id) => api.delete(`/Treatment/DeleteTreatment/${id}`);
 