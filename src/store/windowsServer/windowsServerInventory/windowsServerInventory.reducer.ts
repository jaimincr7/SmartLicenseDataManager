import { booleanLookup } from './../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IWindowsServerInventory } from '../../../services/windowsServer/windowsServerInventory/windowsServerInventory.model';
import { RootState } from '../../app.model';
import {
  searchWindowsServerInventory,
  getWindowsServerInventoryById,
  saveWindowsServerInventory,
  deleteWindowsServerInventory,
} from './windowsServerInventory.action';
import { IWindowsServerInventoryState } from './windowsServerInventory.model';

export const initialState: IWindowsServerInventoryState = {
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

export const windowsServerInventorySlice = createSlice({
  name: 'windowsServerInventory',
  initialState,
  reducers: {
    clearWindowsServerInventory: () => {
      return initialState;
    },
    clearWindowsServerInventoryMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearWindowsServerInventoryGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerInventory.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerInventory>>
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
    [searchWindowsServerInventory.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerInventoryById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerInventoryById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerInventory>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerInventoryById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveWindowsServerInventory.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerInventory.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteWindowsServerInventory.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerInventory.rejected.type]: (
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
export const windowsServerInventorySelector = (state: RootState) => state.windowsServerInventory;

// Actions
export const {
  clearWindowsServerInventory,
  clearWindowsServerInventoryMessages,
  clearWindowsServerInventoryGetById,
} = windowsServerInventorySlice.actions;

// The reducer
export default windowsServerInventorySlice.reducer;