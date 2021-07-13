import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILookup } from '../../services/common/common.model';
import { RootState } from '../app.model';
import {
  getGlobalBULookup,
  getGlobalCompanyLookup,
  getGlobalTenantLookup,
} from './globalSearch.action';
import { IGlobalSearchState, IGlobalSearch } from './globalSearch.model';

export const initialState: IGlobalSearchState = {
  search: {},
  globalTenantLookup: {
    data: [],
    loading: false,
  },
  globalCompanyLookup: {
    data: [],
    loading: false,
  },
  globalBULookup: {
    data: [],
    loading: false,
  },
};

export const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState,
  reducers: {
    setGlobalSearch: (state, action: PayloadAction<IGlobalSearch>) => {
      state.search = action.payload;
    },
    clearGlobalCompanyLookUp: (state) => {
      state.globalCompanyLookup.data = [];
    },
    clearGlobalBULookUp: (state) => {
      state.globalBULookup.data = [];
    },
    clearGlobalSearch: () => {
      return initialState;
    },
  },
  extraReducers: {
    // Tenant lookup
    [getGlobalTenantLookup.pending.type]: (state) => {
      state.globalTenantLookup.loading = true;
    },
    [getGlobalTenantLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.globalTenantLookup.data = action.payload;
      state.globalTenantLookup.loading = false;
    },

    // Company lookup
    [getGlobalCompanyLookup.pending.type]: (state) => {
      state.globalCompanyLookup.loading = true;
    },
    [getGlobalCompanyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.globalCompanyLookup.data = action.payload;
      state.globalCompanyLookup.loading = false;
    },

    // BU lookup
    [getGlobalBULookup.pending.type]: (state) => {
      state.globalBULookup.loading = true;
    },
    [getGlobalBULookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.globalBULookup.data = action.payload;
      state.globalBULookup.loading = false;
    },
  },
});

// A selector
export const globalSearchSelector = (state: RootState) => state.globalSearch;

// Actions
export const { clearGlobalSearch, clearGlobalBULookUp, clearGlobalCompanyLookUp, setGlobalSearch } =
  globalSearchSlice.actions;

// The reducer
export default globalSearchSlice.reducer;
