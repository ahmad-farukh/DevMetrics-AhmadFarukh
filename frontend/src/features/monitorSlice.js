// monitorSlice.js ke andar runAuditThunk ko aysa kar dein:

export const runAuditThunk = createAsyncThunk(
  'monitor/runAudit',
  async (targetUrl, { rejectWithValue }) => {
    try {
      const response = await fetch('https://DEV_METRICS_BACKEND_URL.vercel.app/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);