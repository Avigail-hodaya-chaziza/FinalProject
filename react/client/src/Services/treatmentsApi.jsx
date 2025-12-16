import api from "./api";

// פונקציה לתיקון קידוד עברי
function fixHebrewEncoding(text) {
  if (!text || typeof text !== 'string') return text;
  if (/[\u0590-\u05FF]/.test(text) || /^[a-zA-Z\s]+$/.test(text)) return text;
  if (text.match(/^\?+$/)) return text;
  return text;
}

export const getAllTreatments = async () => {
  const response = await api.get('/Treatment/GetAllTreatments');
  
  // תיקון קידוד עברי לכל טיפול
  const fixedData = response.data.map(treatment => ({
    ...treatment,
    TreatmentName: fixHebrewEncoding(treatment.TreatmentName),
    treatmentName: fixHebrewEncoding(treatment.treatmentName),
    Description: fixHebrewEncoding(treatment.Description),
    description: fixHebrewEncoding(treatment.description)
  }));
  
  return { ...response, data: fixedData };
};

export const addTreatment = (data) => api.post('/Treatment/AddTreatment', data);
export const updateTreatment = (id, data) => api.put(`/Treatment/UpdateTreatment/${id}`, data);
export const deleteTreatment = (id) => api.delete(`/Treatment/DeleteTreatment/${id}`);
 