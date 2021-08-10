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
  tableColumnSelection: {
    id: null,
    table_name: null,
    columns: {},
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
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
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
      if (search_result.column_selection) {
        state.tableColumnSelection.id = search_result.column_selection.id;
        const tableSelectionObj = JSON.parse(search_result.column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = search_result.table_name;
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
    [saveWindowsServerEntitlements.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
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
    [deleteWindowsServerEntitlements.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
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
  setTableColumnSelection,
} = windowsServerEntitlementsSlice.actions;

// The reducer
export default windowsServerEntitlementsSlice.reducer;
