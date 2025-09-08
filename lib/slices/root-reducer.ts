// lib/root-reducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './auth';
import uiReducer from './uiSlice';
import { baseAPI, publicBaseAPI } from '../services';

export const rootReducer = combineReducers({
  [baseAPI.reducerPath]: baseAPI.reducer,
  [publicBaseAPI.reducerPath]: publicBaseAPI.reducer,
  auth: authSlice.reducer,
  ui: uiReducer, // ✅ global loader
});
