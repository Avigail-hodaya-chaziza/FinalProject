import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllTreatments, addTreatment, updateTreatment, deleteTreatment } from '../../Services/treatmentsApi';

export const fetchTreatments = createAsyncThunk('treatments/fetchAll', async () => {
  const res = await getAllTreatments();
  return res.data;
});

export const createTreatment = createAsyncThunk('treatments/create', async (newTreatment) => {
  await addTreatment(newTreatment);
  const res = await getAllTreatments();
  return res.data;
});
// עדכון טיפול קיים
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

// export const editTreatment = createAsyncThunk('treatments/update', async ({ id, data }) => {
//   await updateTreatment(id, data);
//   const res = await getAllTreatments();
//   return res.data;
// });

export const removeTreatment = createAsyncThunk('treatments/delete', async (id) => {
  await deleteTreatment(id);
  const res = await getAllTreatments();
  return res.data;
});

const treatmentsSlice = createSlice({
  name: 'treatments',
  initialState: {
    list: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createTreatment.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(editTreatment.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(removeTreatment.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export default treatmentsSlice.reducer;
