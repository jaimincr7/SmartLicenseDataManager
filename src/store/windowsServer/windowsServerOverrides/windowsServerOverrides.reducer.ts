import { booleanLookup } from './../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IWindowsServerOverrides } from '../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';
import { RootState } from '../../app.model';
import {
  searchWindowsServerOverrides,
  getWindowsServerOverridesById,
  saveWindowsServerOverrides,
  deleteWindowsServerOverrides,
} from './windowsServerOverrides.action';
import { IWindowsServerOverridesState } from './windowsServerOverrides.model';

export const initialState: IWindowsServerOverridesState = {
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

export const windowsServerOverridesSlice = createSlice({
  name: 'windowsServerOverrides',
  initialState,
  reducers: {
    clearWindowsServerOverrides: () => {
      return initialState;
    },
    clearWindowsServerOverridesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearWindowsServerOverridesGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerOverrides.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerOverrides>>
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
    [searchWindowsServerOverrides.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerOverridesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerOverridesById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerOverrides>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerOverridesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveWindowsServerOverrides.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerOverrides.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteWindowsServerOverrides.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerOverrides.rejected.type]: (
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
export const windowsServerOverridesSelector = (state: RootState) => state.windowsServerOverrides;

// Actions
export const {
  clearWindowsServerOverrides,
  clearWindowsServerOverridesMessages,
  clearWindowsServerOverridesGetById,
} = windowsServerOverridesSlice.actions;

// The reducer
export default windowsServerOverridesSlice.reducer;