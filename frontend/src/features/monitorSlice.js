import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Live Vercel Backend Audit Thunk
export const runAuditThunk = createAsyncThunk(
  'monitor/runAudit',
  async (targetUrl, { rejectWithValue }) => {
    try {
      const response = await fetch('https://backend-murex-seven-0jrmu1gs5t.vercel.app/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error('Audit request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  audits: [], // Hamesha empty array se start hoga
  searchQuery: '',
  statusFilter: 'ALL',
  editingAuditItem: null,
  loading: false,
  error: null,
};

const monitorSlice = createSlice({
  name: 'monitor',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload || '';
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload || 'ALL';
    },
    deleteAuditItem: (state, action) => {
      if (Array.isArray(state.audits)) {
        state.audits = state.audits.filter((item) => item?.id !== action.payload);
      }
    },
    setEditingAuditItem: (state, action) => {
      state.editingAuditItem = action.payload || null;
    },
    updateAuditItem: (state, action) => {
      if (Array.isArray(state.audits) && action.payload?.id) {
        const index = state.audits.findIndex((item) => item?.id === action.payload.id);
        if (index !== -1) {
          state.audits[index] = { ...state.audits[index], ...action.payload };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runAuditThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runAuditThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.audits)) {
          state.audits = [];
        }
        if (action.payload) {
          state.audits.unshift(action.payload);
        }
      })
      .addCase(runAuditThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to run audit';
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  deleteAuditItem,
  setEditingAuditItem,
  updateAuditItem,
} = monitorSlice.actions;

export default monitorSlice.reducer;