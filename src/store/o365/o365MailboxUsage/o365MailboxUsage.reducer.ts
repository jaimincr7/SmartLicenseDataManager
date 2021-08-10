import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import {
  deleteO365MailboxUsage,
  getO365MailboxUsageById,
  saveO365MailboxUsage,
  searchO365MailboxUsage,
} from './o365MailboxUsage.action';
import { IO365MailboxUsageState } from './o365MailboxUsage.model';
import { IO365MailboxUsage } from '../../../services/o365/o365MailboxUsage/o365MailboxUsage.model';

export const initialState: IO365MailboxUsageState = {
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

export const o365MailboxUsageSlice = createSlice({
  name: 'o365MailboxUsage',
  initialState,
  reducers: {
    clearO365MailboxUsage: () => {
      return initialState;
    },
    clearO365MailboxUsageMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365MailboxUsageGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365MailboxUsage.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365MailboxUsage.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365MailboxUsage>>
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
    [searchO365MailboxUsage.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365MailboxUsageById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365MailboxUsageById.fulfilled.type]: (state, action: PayloadAction<IO365MailboxUsage>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365MailboxUsageById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365MailboxUsage.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365MailboxUsage.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365MailboxUsage.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365MailboxUsage.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365MailboxUsage.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365MailboxUsage.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365MailboxUsageSelector = (state: RootState) => state.o365MailboxUsage;

// Actions
export const {
  clearO365MailboxUsage,
  clearO365MailboxUsageMessages,
  clearO365MailboxUsageGetById,
  setTableColumnSelection,
} = o365MailboxUsageSlice.actions;

// The reducer
export default o365MailboxUsageSlice.reducer;
