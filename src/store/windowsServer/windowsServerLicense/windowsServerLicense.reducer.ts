import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IWindowsServerLicense } from '../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';
import { RootState } from '../../app.model';
import {
  deleteWindowsServerLicense,
  getWindowsServerLicenseById,
  reRunAllScenariosWindows,
  saveWindowsServerLicense,
  searchWindowsServerLicense,
} from './windowsServerLicense.action';
import { IWindowsServerLicenseState } from './windowsServerLicense.model';

export const initialState: IWindowsServerLicenseState = {
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
  reRunAllScenariosWindows: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const windowsServerLicenseSlice = createSlice({
  name: 'windowsServerLicense',
  initialState,
  reducers: {
    clearWindowsServerLicense: () => {
      return initialState;
    },
    clearWindowsServerLicenseMessages: (state) => {
      state.save.messages = [];
      state.reRunAllScenariosWindows.messages = [];
      state.delete.messages = [];
    },
    clearWindowsServerLicenseGetById: (state) => {
      state.getById.data = null;
    },
    clearWindowsServerLicenseReRunAllScenariosMessages: (state) => {
      state.reRunAllScenariosWindows.messages = [];
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerLicense.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerLicense>>
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
    [searchWindowsServerLicense.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerLicenseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerLicenseById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerLicense>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerLicenseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveWindowsServerLicense.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerLicense.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteWindowsServerLicense.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerLicense.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Re-run all scenario
    [reRunAllScenariosWindows.pending.type]: (state) => {
      state.reRunAllScenariosWindows.loading = true;
      state.reRunAllScenariosWindows.messages = [];
    },
    [reRunAllScenariosWindows.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.reRunAllScenariosWindows.loading = false;
      state.reRunAllScenariosWindows.hasErrors = false;
      state.reRunAllScenariosWindows.messages = action.payload.messages;
    },
    [reRunAllScenariosWindows.rejected.type]: (state) => {
      state.reRunAllScenariosWindows.loading = false;
      state.reRunAllScenariosWindows.hasErrors = true;
    },
  },
});

// A selector
export const windowsServerLicenseSelector = (state: RootState) => state.windowsServerLicense;

// Actions
export const {
  clearWindowsServerLicense,
  clearWindowsServerLicenseMessages,
  clearWindowsServerLicenseGetById,
  clearWindowsServerLicenseReRunAllScenariosMessages,
  setTableColumnSelection,
} = windowsServerLicenseSlice.actions;

// The reducer
export default windowsServerLicenseSlice.reducer;
