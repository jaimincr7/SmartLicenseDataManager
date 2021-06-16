import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app.model';
import { IErrorLog, IErrorLogState } from './errorLog.model';

export const initialState: IErrorLogState = {
  errors: [],
};

export const errorLogSlice = createSlice({
  name: 'errorLog',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<IErrorLog>) => {
      state.errors.push(action.payload);
    },
    removeError: () => {
      return initialState;
    },
  },
});

// A selector
export const errorLogSelector = (state: RootState) => state.errorLog;

// Actions
export const { addError, removeError } = errorLogSlice.actions;

// The reducer
export default errorLogSlice.reducer;
