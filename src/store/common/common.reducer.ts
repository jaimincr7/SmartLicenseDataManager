import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../common/models/common';
import { ILookup } from '../../services/common/common.model';
import { RootState } from '../app.model';
import {
  getBULookup,
  getCompanyLookup,
  getSqlServerLicenseLookup,
  getTenantLookup,
  getAgreementTypesLookup,
  getCurrencyLookup,
  deleteDataset,
  getWindowsServerLicenseLookup,
  saveTableColumnSelection,
  getAllCompanyLookup,
  getO365ProductsLookup,
} from './common.action';
import { ICommonState } from './common.model';

export const initialState: ICommonState = {
  tenantLookup: {
    data: [],
    loading: false,
  },
  companyLookup: {
    data: [],
    loading: false,
  },
  allCompanyLookup: {
    data: [],
    loading: false,
  },
  buLookup: {
    data: [],
    loading: false,
  },
  sqlServerLicenseLookup: {
    data: [],
    loading: false,
  },
  agreementTypesLookup: {
    data: [],
    loading: false,
  },
  currencyLookup: {
    data: [],
    loading: false,
  },
  windowsServerLicenseLookup: {
    data: [],
    loading: false,
  },
  o365ProductsLookup: {
    data: [],
    loading: false,
  },
  deleteDataset: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  saveTableColumnSelection: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    // setGlobalSearch: (state, action: PayloadAction<IGlobalSearch>) => {
    //   state.search = action.payload;
    // },
    clearDeleteDatasetMessages: (state) => {
      state.deleteDataset.messages = [];
    },
    clearCompanyLookUp: (state) => {
      state.companyLookup.data = [];
    },
    clearBULookUp: (state) => {
      state.buLookup.data = [];
    },
    clearCommon: () => {
      return initialState;
    },
    clearSaveTableColumnSelection: (state) => {
      state.saveTableColumnSelection.messages = [];
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

    // All Company lookup
    [getAllCompanyLookup.pending.type]: (state) => {
      state.allCompanyLookup.loading = true;
    },
    [getAllCompanyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.allCompanyLookup.data = action.payload;
      state.allCompanyLookup.loading = false;
    },

    // BU lookup
    [getBULookup.pending.type]: (state) => {
      state.buLookup.loading = true;
    },
    [getBULookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.buLookup.data = action.payload;
      state.buLookup.loading = false;
    },

    // Sql Server License lookup
    [getSqlServerLicenseLookup.pending.type]: (state) => {
      state.sqlServerLicenseLookup.loading = true;
    },
    [getSqlServerLicenseLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.sqlServerLicenseLookup.data = action.payload;
      state.sqlServerLicenseLookup.loading = false;
    },

    // Agreement Types lookup
    [getAgreementTypesLookup.pending.type]: (state) => {
      state.agreementTypesLookup.loading = true;
    },
    [getAgreementTypesLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.agreementTypesLookup.data = action.payload;
      state.agreementTypesLookup.loading = false;
    },

    // Currency lookup
    [getCurrencyLookup.pending.type]: (state) => {
      state.currencyLookup.loading = true;
    },
    [getCurrencyLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.currencyLookup.data = action.payload;
      state.currencyLookup.loading = false;
    },

    // Windows Server License lookup
    [getWindowsServerLicenseLookup.pending.type]: (state) => {
      state.windowsServerLicenseLookup.loading = true;
    },
    [getWindowsServerLicenseLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.windowsServerLicenseLookup.data = action.payload;
      state.windowsServerLicenseLookup.loading = false;
    },

    // O365 Products lookup
    [getO365ProductsLookup.pending.type]: (state) => {
      state.o365ProductsLookup.loading = true;
    },
    [getO365ProductsLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.o365ProductsLookup.data = action.payload;
      state.o365ProductsLookup.loading = false;
    },

    // Delete Dataset
    [deleteDataset.pending.type]: (state) => {
      state.deleteDataset.loading = true;
      state.deleteDataset.messages = [];
    },
    [deleteDataset.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.deleteDataset.loading = false;
      state.deleteDataset.hasErrors = false;
      state.deleteDataset.messages = action.payload.messages;
    },
    [deleteDataset.rejected.type]: (state) => {
      state.deleteDataset.loading = false;
      state.deleteDataset.hasErrors = true;
    },

    // Save Table Column Selection
    [saveTableColumnSelection.pending.type]: (state) => {
      state.saveTableColumnSelection.loading = true;
      state.saveTableColumnSelection.messages = [];
    },
    [saveTableColumnSelection.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveTableColumnSelection.loading = false;
      state.saveTableColumnSelection.hasErrors = false;
      state.saveTableColumnSelection.messages = action.payload.messages;
    },
    [saveTableColumnSelection.rejected.type]: (state) => {
      state.saveTableColumnSelection.loading = false;
      state.saveTableColumnSelection.hasErrors = true;
    },
  },
});

// A selector
export const commonSelector = (state: RootState) => state.common;

// Actions
export const {
  clearCommon,
  clearBULookUp,
  clearCompanyLookUp,
  // setGlobalSearch,
  clearDeleteDatasetMessages,
  clearSaveTableColumnSelection,
} = commonSlice.actions;

// The reducer
export default commonSlice.reducer;
