import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/commont';
import { ISqlServer } from '../../services/sqlServer/sqlServer.model';
import { RootState } from '../app.model';
import {
  deleteSqlServer,
  getSqlServerById,
  saveSqlServer,
  searchSqlServer,
} from './sqlServer.action';
import { ISqlServerState } from './sqlServer.model';

export const initialState: ISqlServerState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
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

export const sqlServerSlice = createSlice({
  name: 'sqlServer',
  initialState,
  reducers: {
    clearSqlServer: () => {
      return initialState;
    },
    clearSqlServerMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSqlServerGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServer.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServer.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServer>>
    ) => {
      state.search.data = action.payload.search_result.records;
      state.search.count = action.payload.search_result.total_count;
      state.search.loading = false;
      state.search.hasErrors = false;
    },
    [searchSqlServer.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerById.fulfilled.type]: (state, action: PayloadAction<ISqlServer>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServer.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServer.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServer.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteSqlServer.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServer.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServer.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },
  },
});

// A selector
export const sqlServerSelector = (state: RootState) => state.sqlServer;

// Actions
export const { clearSqlServer, clearSqlServerMessages, clearSqlServerGetById } = sqlServerSlice.actions;

// The reducer
export default sqlServerSlice.reducer;
