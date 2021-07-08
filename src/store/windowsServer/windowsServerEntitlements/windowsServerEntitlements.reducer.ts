import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IWindowsServerEntitlements } from '../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.model';
import { RootState } from '../../app.model';
import {
  searchWindowsServerEntitlements,
  getWindowsServerEntitlementsById,
  saveWindowsServerEntitlements,
  deleteWindowsServerEntitlements,
} from './windowsServerEntitlements.action';
import { IWindowsServerEntitlementsState } from './windowsServerEntitlements.model';

export const initialState: IWindowsServerEntitlementsState = {
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

export const windowsServerEntitlementsSlice = createSlice({
  name: 'windowsServerEntitlements',
  initialState,
  reducers: {
    clearWindowsServerEntitlements: () => {
      return initialState;
    },
    clearWindowsServerEntitlementsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearWindowsServerEntitlementsGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerEntitlements.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerEntitlements.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerEntitlements>>
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
    [searchWindowsServerEntitlements.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerEntitlementsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerEntitlementsById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerEntitlements>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerEntitlementsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveWindowsServerEntitlements.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerEntitlements.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerEntitlements.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteWindowsServerEntitlements.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerEntitlements.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerEntitlements.rejected.type]: (
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
export const windowsServerEntitlementsSelector = (state: RootState) =>
  state.windowsServerEntitlements;

// Actions
export const {
  clearWindowsServerEntitlements,
  clearWindowsServerEntitlementsMessages,
  clearWindowsServerEntitlementsGetById,
} = windowsServerEntitlementsSlice.actions;

// The reducer
export default windowsServerEntitlementsSlice.reducer;