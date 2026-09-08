import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Safe Browser-Compatible Environment Variable Reader
const getApiBaseUrl = () => {
  let url = 'https://dev-metrics-ahmad-farukh.vercel.app';
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  } else if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    url = process.env.REACT_APP_API_URL;
  }
  return url.replace(/\/+$/, ''); // Remove any trailing slash to prevent double slashes
};

const API_BASE_URL = getApiBaseUrl();

export const runAuditThunk = createAsyncThunk(
  'monitor/runAudit',
  async (targetUrl, { rejectWithValue }) => {
    // Timeout set to 25s for cross-device & serverless cold-start latency
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return rejectWithValue('Audit request timed out. Target website is taking too long to respond.');
      }
      return rejectWithValue(error.message || 'Failed to connect to audit server.');
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
  errorMessage: '',
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
      if (state.currentAudit && state.currentAudit.id === action.payload) {
        state.currentAudit = null;
      }
    },
    setEditingAuditItem: (state, action) => {
      state.editingAuditItem = action.payload;
    },
    updateAuditItem: (state, action) => {
      if (!action.payload || !action.payload.id) return;
      
      const index = (state.auditHistory || []).findIndex(
        (item) => item && item.id === action.payload.id
      );
      
      if (index !== -1) {
        state.auditHistory[index] = { ...state.auditHistory[index], ...action.payload };
      }

      if (state.currentAudit && state.currentAudit.id === action.payload.id) {
        state.currentAudit = { ...state.currentAudit, ...action.payload };
      }
      
      state.editingAuditItem = null;
    },
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
          responseTimeMs: payload.responseTimeMs || 0,
          isHttps: payload.isHttps !== undefined ? payload.isHttps : true,
          securityScore: payload.securityScore !== undefined ? payload.securityScore : 100,
          speedScore: payload.speedScore !== undefined ? payload.speedScore : 85,
          speedLabel: payload.speedLabel || 'FAST',
          securityIssues: Array.isArray(payload.securityIssues) ? payload.securityIssues : [],
          speedIssues: Array.isArray(payload.speedIssues) ? payload.speedIssues : [],
          responsivenessIssues: Array.isArray(payload.responsivenessIssues) ? payload.responsivenessIssues : [],
          codeFlaws: Array.isArray(payload.codeFlaws) ? payload.codeFlaws : [],
          frontendTech: Array.isArray(payload.frontendTech) ? payload.frontendTech : ['HTML5 Engine'],
          backendTech: Array.isArray(payload.backendTech) ? payload.backendTech : ['Node.js Server'],
          thirdPartyServices: Array.isArray(payload.thirdPartyServices) ? payload.thirdPartyServices : ['Standard CDN'],
          apisDetected: Array.isArray(payload.apisDetected) ? payload.apisDetected : ['REST API Services'],
          fontFamilies: Array.isArray(payload.fontFamilies) ? payload.fontFamilies : ['System Sans'],
          colorPalette: Array.isArray(payload.colorPalette) ? payload.colorPalette : ['#000000', '#FFFFFF', '#DC2626'],
          seo: payload.seo || { metaDescription: 'N/A', hasOgImage: false, hasOgTitle: false },
          assetBreakdown: payload.assetBreakdown || { scriptCount: 0, stylesheetCount: 0, imageCount: 0, htmlSizeBytes: 0 },
          timestamp: payload.timestamp || new Date().toLocaleTimeString(),
        };

        state.currentAudit = safeAudit;

        if (!Array.isArray(state.auditHistory)) {
          state.auditHistory = [];
        }
        state.auditHistory.unshift(safeAudit);
      })
      .addCase(runAuditThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Failed to complete website performance audit.';
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