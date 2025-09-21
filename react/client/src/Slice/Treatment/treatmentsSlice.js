import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Services/api';

// פעולה אסינכרונית לשליפת כל הטיפולים מה-API
export const fetchTreatments = createAsyncThunk(
  'treatments/fetchTreatments',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/Treatment/GetAllTreatments');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// פעולה אסינכרונית להוספת טיפול חדש
export const addTreatment = createAsyncThunk(
  'treatments/addTreatment',
  async (newTreatment, thunkAPI) => {
    try {
      const response = await api.post('/Treatment/AddTreatment', newTreatment);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// פעולה אסינכרונית לעדכון טיפול קיים
export const UpdateTreatment = createAsyncThunk(
  'treatments/UpdateTreatment',
  async ({ treatmentId, updatedData }, thunkAPI) => {
    try {
      const response = await api.put(`/Treatment/UpdateTreatment/${treatmentId}`, updatedData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// פעולה אסינכרונית למחיקת טיפול
export const removeTreatment = createAsyncThunk(
  'treatments/removeTreatment',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/Treatment/DeleteTreatment/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- INITIAL STATE ---
const initialState = {
  list: [],
  loading: false,
  error: null
};

// --- SLICE ---
const treatmentsSlice = createSlice({
  name: 'treatments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // טיפול בפעולת fetchTreatments
      .addCase(fetchTreatments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTreatments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // טיפול בפעולת addTreatment
      .addCase(addTreatment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTreatment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addTreatment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(UpdateTreatment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateTreatment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTreatment = action.payload;
        const existingTreatmentIndex = state.list.findIndex(t => t.id === updatedTreatment.id);
        if (existingTreatmentIndex !== -1) {
          state.list[existingTreatmentIndex] = updatedTreatment;
        }
      })
      .addCase(UpdateTreatment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // טיפול בפעולת removeTreatment
      .addCase(removeTreatment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTreatment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(t => t.id !== action.payload);
      })
      .addCase(removeTreatment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = treatmentsSlice.actions;
export default treatmentsSlice.reducer;