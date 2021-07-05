import { booleanLookup } from './../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import { ISqlServerLicense } from '../../services/sqlServerLicense/sqlServerLicense.model';
import { RootState } from '../app.model';
import {
  deleteSqlServerLicense,
  getSqlServerLicenseById,
  saveSqlServerLicense,
  searchSqlServerLicense,
} from './sqlServerLicense.action';
import { ISqlServerLicenseState } from './sqlServerLicense.model';

export const initialState: ISqlServerLicenseState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
  },
  getById: {
    loading: false,
    hasErrors: false,
    data: null,
  },
  save: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  delete: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const sqlServerLicenseSlice = createSlice({
  name: 'sqlServerLicense',
  initialState,
  reducers: {
    clearSqlServerLicense: () => {
      return initialState;
    },
    clearSqlServerLicenseMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSqlServerLicenseGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerLicense.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerLicense>>
    ) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest, booleanLookup };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
    },
    [searchSqlServerLicense.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerLicenseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerLicenseById.fulfilled.type]: (state, action: PayloadAction<ISqlServerLicense>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerLicenseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerLicense.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerLicense.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteSqlServerLicense.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerLicense.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },
  },
});

// A selector
export const sqlServerLicenseSelector = (state: RootState) => state.sqlServerLicense;

// Actions
export const {
  clearSqlServerLicense,
  clearSqlServerLicenseMessages,
  clearSqlServerLicenseGetById,
} = sqlServerLicenseSlice.actions;

// The reducer
export default sqlServerLicenseSlice.reducer;
