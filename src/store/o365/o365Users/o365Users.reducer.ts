import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IO365Users } from '../../../services/o365/o365Users/o365Users.model';
import { RootState } from '../../app.model';
import {
  deleteO365Users,
  getO365UsersById,
  processDataO365,
  saveO365Users,
  searchO365Users,
} from './o365Users.action';
import { IO365UsersState } from './o365Users.model';

export const initialState: IO365UsersState = {
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
  processData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const o365UsersSlice = createSlice({
  name: 'o365Users',
  initialState,
  reducers: {
    clearO365Users: () => {
      return initialState;
    },
    clearO365UsersMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365ProcessDataMessages: (state) => {
      state.processData.messages = [];
    },
    clearO365UsersGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365Users.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365Users.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365Users>>
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
    [searchO365Users.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365UsersById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365UsersById.fulfilled.type]: (state, action: PayloadAction<IO365Users>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365UsersById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365Users.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365Users.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365Users.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365Users.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365Users.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365Users.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataO365.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataO365.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataO365.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const o365UsersSelector = (state: RootState) => state.o365Users;

// Actions
export const {
  clearO365Users,
  clearO365UsersMessages,
  clearO365UsersGetById,
  setTableColumnSelection,
  clearO365ProcessDataMessages,
} = o365UsersSlice.actions;

// The reducer
export default o365UsersSlice.reducer;
