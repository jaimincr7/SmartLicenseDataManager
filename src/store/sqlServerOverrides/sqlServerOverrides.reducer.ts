import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import { ISqlServerOverrides } from '../../services/sqlServerOverrides/sqlServerOverrides.model';
import { RootState } from '../app.model';
import {
  searchSqlServerOverrides,
  getSqlServerOverridesById,
  saveSqlServerOverrides,
  deleteSqlServerOverrides,
  processData,
} from './sqlServerOverrides.action';
import { ISqlServerOverridesState } from './sqlServerOverrides.model';

export const initialState: ISqlServerOverridesState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
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
  processData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const sqlServerOverridesSlice = createSlice({
  name: 'sqlServerOverrides',
  initialState,
  reducers: {
    clearSqlServerOverrides: () => {
      return initialState;
    },
    clearSqlServerOverridesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearSqlServerOverridesGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerOverrides.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerOverrides>>
    ) => {
      const { search_result, ...rest } = action.payload;
      const booleanLookup = [
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' },
      ];

      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest, booleanLookup };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
    },
    [searchSqlServerOverrides.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerOverridesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerOverridesById.fulfilled.type]: (
      state,
      action: PayloadAction<ISqlServerOverrides>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerOverridesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerOverrides.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerOverrides.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteSqlServerOverrides.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerOverrides.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },

    // Process Data
    [processData.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processData.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processData.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
      state.processData.messages = action.payload.errors;
    },
  },
});

// A selector
export const sqlServerOverridesSelector = (state: RootState) => state.sqlServerOverrides;

// Actions
export const {
  clearSqlServerOverrides,
  clearSqlServerOverridesMessages,
  clearSqlServerOverridesGetById,
} = sqlServerOverridesSlice.actions;

// The reducer
export default sqlServerOverridesSlice.reducer;
