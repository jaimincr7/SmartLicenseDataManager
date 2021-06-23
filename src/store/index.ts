import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './combined.reducers';

export const store = configureStore({
  reducer: rootReducer,
});
