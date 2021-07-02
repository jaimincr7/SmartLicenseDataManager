import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import { ISqlServerEntitlements } from '../../services/sqlServerEntitlements/sqlServerEntitlements.model';
import { RootState } from '../app.model';
import {
  deleteSqlServerEntitlements,
  getSqlServerEntitlementsById,
  saveSqlServerEntitlements,
  searchSqlServerEntitlements,
} from './sqlServerEntitlements.action';
import { ISqlServerEntitlementsState } from './sqlServerEntitlements.model';

export const initialState: ISqlServerEntitlementsState = {
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

export const sqlServerEntitlementsSlice = createSlice({
  name: 'sqlServerEntitlements',
  initialState,
  reducers: {
    clearSqlServerEntitlements: () => {
      return initialState;
    },
    clearSqlServerEntitlementsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSqlServerEntitlementsGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerEntitlements.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerEntitlements.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerEntitlements>>
    ) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
    },
    [searchSqlServerEntitlements.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerEntitlementsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerEntitlementsById.fulfilled.type]: (
      state,
      action: PayloadAction<ISqlServerEntitlements>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerEntitlementsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerEntitlements.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerEntitlements.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerEntitlements.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteSqlServerEntitlements.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerEntitlements.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerEntitlements.rejected.type]: (
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
export const sqlServerEntitlementsSelector = (state: RootState) => state.sqlServerEntitlements;

// Actions
export const {
  clearSqlServerEntitlements,
  clearSqlServerEntitlementsMessages,
  clearSqlServerEntitlementsGetById,
} = sqlServerEntitlementsSlice.actions;

// The reducer
export default sqlServerEntitlementsSlice.reducer;
