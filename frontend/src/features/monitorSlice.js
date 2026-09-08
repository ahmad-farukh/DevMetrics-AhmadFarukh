import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://dev-metrics-ahmad-farukh-ivkv-7x6gxlmyk.vercel.app/';

export const runAuditThunk = createAsyncThunk(
  'monitor/runAudit',
  async (targetUrl, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: targetUrl
        })
      });

      if (!response.ok) {
        throw new Error('Audit request failed');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Server connection failed'
      );
    }
  }
);

const initialState = {
  currentAudit: null,
  auditHistory: [],
  searchQuery: '',
  statusFilter: 'ALL',
  editingAuditItem: null,
  loading: false,
  errorMessage: ''
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
      state.auditHistory = (state.auditHistory || []).filter(
        (item) => item && item.id !== action.payload
      );

      if (
        state.currentAudit &&
        state.currentAudit.id === action.payload
      ) {
        state.currentAudit = null;
      }
    },

    setEditingAuditItem: (state, action) => {
      state.editingAuditItem = action.payload;
    },

    updateAuditItem: (state, action) => {
      if (!action.payload || !action.payload.id) {
        return;
      }

      const index = (state.auditHistory || []).findIndex(
        (item) =>
          item && item.id === action.payload.id
      );

      if (index !== -1) {
        state.auditHistory[index] = {
          ...state.auditHistory[index],
          ...action.payload
        };
      }

      if (
        state.currentAudit &&
        state.currentAudit.id === action.payload.id
      ) {
        state.currentAudit = {
          ...state.currentAudit,
          ...action.payload
        };
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

        const payload = action.payload || {};

        const safeAudit = {
          id: payload.id || Date.now().toString(),
          url: payload.url || 'N/A',
          status: payload.status || 'ONLINE',
          statusCode: payload.statusCode || 200,
          responseTimeMs:
            payload.responseTimeMs ||
            payload.responseTime ||
            0,
          isHttps:
            payload.isHttps !== undefined
              ? payload.isHttps
              : true,
          securityScore:
            payload.securityScore !== undefined
              ? payload.securityScore
              : 100,
          speedScore:
            payload.speedScore !== undefined
              ? payload.speedScore
              : 100,
          securityIssues:
            Array.isArray(payload.securityIssues)
              ? payload.securityIssues
              : [],
          speedIssues:
            Array.isArray(payload.speedIssues)
              ? payload.speedIssues
              : [],
          responsivenessIssues:
            Array.isArray(payload.responsivenessIssues)
              ? payload.responsivenessIssues
              : [],
          codeFlaws:
            Array.isArray(payload.codeFlaws)
              ? payload.codeFlaws
              : [],
          frontendTech:
            Array.isArray(payload.frontendTech)
              ? payload.frontendTech
              : ['HTML5 / Modern Frontend'],
          backendTech:
            Array.isArray(payload.backendTech)
              ? payload.backendTech
              : ['Node.js Engine'],
          thirdPartyServices:
            Array.isArray(payload.thirdPartyServices)
              ? payload.thirdPartyServices
              : ['Standard CDN'],
          apisDetected:
            Array.isArray(payload.apisDetected)
              ? payload.apisDetected
              : ['REST Services'],
          fontFamilies:
            Array.isArray(payload.fontFamilies)
              ? payload.fontFamilies
              : ['System Sans'],
          colorPalette:
            Array.isArray(payload.colorPalette)
              ? payload.colorPalette
              : ['#000000', '#FFFFFF', '#DC2626'],
          timestamp:
            payload.timestamp ||
            new Date().toLocaleTimeString()
        };

        state.currentAudit = safeAudit;

        if (!Array.isArray(state.auditHistory)) {
          state.auditHistory = [];
        }

        state.auditHistory.unshift(safeAudit);
      })

      .addCase(runAuditThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload ||
          'Failed to complete website audit';
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