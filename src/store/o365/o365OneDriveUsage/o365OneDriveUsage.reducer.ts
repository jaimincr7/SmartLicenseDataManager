import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IO365OneDriveUsage } from '../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.model';
import { RootState } from '../../app.model';
import {
  deleteO365OneDriveUsage,
  getO365OneDriveUsageById,
  saveO365OneDriveUsage,
  searchO365OneDriveUsage,
} from './o365OneDriveUsage.action';
import { IO365OneDriveUsageState } from './o365OneDriveUsage.model';

export const initialState: IO365OneDriveUsageState = {
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

export const o365OneDriveUsageSlice = createSlice({
  name: 'o365OneDriveUsage',
  initialState,
  reducers: {
    clearO365OneDriveUsage: () => {
      return initialState;
    },
    clearO365OneDriveUsageMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365OneDriveUsageGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365OneDriveUsage.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365OneDriveUsage.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365OneDriveUsage>>
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
    [searchO365OneDriveUsage.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365OneDriveUsageById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365OneDriveUsageById.fulfilled.type]: (
      state,
      action: PayloadAction<IO365OneDriveUsage>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365OneDriveUsageById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365OneDriveUsage.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365OneDriveUsage.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365OneDriveUsage.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365OneDriveUsage.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365OneDriveUsage.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365OneDriveUsage.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365OneDriveUsageSelector = (state: RootState) => state.o365OneDriveUsage;

// Actions
export const {
  clearO365OneDriveUsage,
  clearO365OneDriveUsageMessages,
  clearO365OneDriveUsageGetById,
  setTableColumnSelection,
} = o365OneDriveUsageSlice.actions;

// The reducer
export default o365OneDriveUsageSlice.reducer;
