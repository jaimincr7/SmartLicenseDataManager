import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigWindowsServerEditionsState } from './windowsServerEditions.model';
import {
  deleteConfigWindowsServerEditions,
  getConfigWindowsServerEditionsById,
  saveConfigWindowsServerEditions,
  searchConfigWindowsServerEditions,
} from './windowsServerEditions.action';
import { IConfigWindowsServerEditions } from '../../../services/master/windowsServerEditions/windowsServerEditions.model';

export const initialState: IConfigWindowsServerEditionsState = {
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

export const configWindowsServerEditionsSlice = createSlice({
  name: 'configWindowsServerEditions',
  initialState,
  reducers: {
    clearConfigWindowsServerEditions: () => {
      return initialState;
    },
    clearConfigWindowsServerEditionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigWindowsServerEditionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigWindowsServerEditions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigWindowsServerEditions.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      if (column_selection) {
        state.tableColumnSelection.id = column_selection.id;
        const tableSelectionObj = JSON.parse(column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = table_name;
    },
    [searchConfigWindowsServerEditions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigWindowsServerEditionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigWindowsServerEditionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigWindowsServerEditions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigWindowsServerEditionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigWindowsServerEditions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigWindowsServerEditions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigWindowsServerEditions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigWindowsServerEditions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigWindowsServerEditions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigWindowsServerEditions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configWindowsServerEditionsSelector = (state: RootState) =>
  state.configWindowsServerEditions;

// Actions
export const {
  clearConfigWindowsServerEditions,
  clearConfigWindowsServerEditionsMessages,
  clearConfigWindowsServerEditionsGetById,
  setTableColumnSelection,
} = configWindowsServerEditionsSlice.actions;

// The reducer
export default configWindowsServerEditionsSlice.reducer;
