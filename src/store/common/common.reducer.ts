import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILookup } from '../../services/common/common.model';
import { RootState } from '../app.model';
import { getBULookup, getCompanyLookup, getTenantLookup } from './common.action';
import { ICommonState } from './common.model';

export const initialState: ICommonState = {
  tenantLookup: {
    data: [],
    loading: false
  },
  companyLookup: {
    data: [],
    loading: false
  },
  buLookup: {
    data: [],
    loading: false
  }
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    clearCommon: () => {
      return initialState;
    },
  },
  extraReducers: {
    // Tenant lookup
    [getTenantLookup.pending.type]: (state) => {
      state.tenantLookup.loading = true;
    },
    [getTenantLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.tenantLookup.data = action.payload;
      state.tenantLookup.loading = false;
    },

    // Company lookup
    [getCompanyLookup.pending.type]: (state) => {
      state.companyLookup.loading = true;
    },
    [getCompanyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.companyLookup.data = action.payload;
      state.companyLookup.loading = false;
    },

    // BU lookup
    [getBULookup.pending.type]: (state) => {
      state.buLookup.loading = true;
    },
    [getBULookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.buLookup.data = action.payload;
      state.buLookup.loading = false;
    },

  },
});

// A selector
export const commonSelector = (state: RootState) => state.common;

// Actions
export const { clearCommon } = commonSlice.actions;

// The reducer
export default commonSlice.reducer;
