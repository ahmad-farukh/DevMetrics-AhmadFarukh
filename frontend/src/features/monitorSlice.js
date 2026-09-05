import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const runAuditThunk = createAsyncThunk(
  'monitor/runAuditThunk',
  async (targetUrl, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/audit', {
        url: targetUrl
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to connect to audit engine server.');
    }
  }
);

const monitorSlice = createSlice({
  name: 'monitor',
  initialState: {
    auditHistory: [],
    currentAudit: null,
    loading: false,
    errorMessage: '',
    searchQuery: '',
    statusFilter: 'ALL',
    editingAuditItem: null
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    deleteAuditItem: (state, action) => {
      const targetId = action.payload;
      state.auditHistory = state.auditHistory.filter((item) => item.id !== targetId);
      if (state.currentAudit && state.currentAudit.id === targetId) {
        state.currentAudit = null;
      }
    },
    setEditingAuditItem: (state, action) => {
      state.editingAuditItem = action.payload;
    },
    updateAuditItem: (state, action) => {
      const updatedItem = action.payload;
      const index = state.auditHistory.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        state.auditHistory[index] = updatedItem;
      }
      if (state.currentAudit && state.currentAudit.id === updatedItem.id) {
        state.currentAudit = updatedItem;
      }
      state.editingAuditItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runAuditThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(runAuditThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAudit = action.payload;
        state.auditHistory.unshift(action.payload);
      })
      .addCase(runAuditThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errorMessage = action.payload;
        } else {
          state.errorMessage = 'An error occurred while inspecting the URL.';
        }
      });
  }
});

export const {
  setSearchQuery,
  setStatusFilter,
  deleteAuditItem,
  setEditingAuditItem,
  updateAuditItem
} = monitorSlice.actions;

export default monitorSlice.reducer;