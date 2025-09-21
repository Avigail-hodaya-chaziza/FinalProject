import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomers } from '../../Services/customerApi';

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async () => {
  const response = await getAllCustomers();
  return response;
});

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers פה (לעריכה, סימון וכו')
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default customersSlice.reducer;
