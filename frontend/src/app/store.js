import { configureStore } from '@reduxjs/toolkit';
import monitorReducer from '../features/monitorSlice';

export const store = configureStore({
  reducer: {
    monitor: monitorReducer
  }
});