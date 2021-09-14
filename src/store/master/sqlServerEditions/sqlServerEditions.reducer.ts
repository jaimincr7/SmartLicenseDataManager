import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigSqlServerEditionsState } from './sqlServerEditions.model';
import {
  deleteConfigSqlServerEditions,
  getConfigSqlServerEditionsById,
  saveConfigSqlServerEditions,
  searchConfigSqlServerEditions,
} from './sqlServerEditions.action';
import { IConfigSqlServerEditions } from '../../../services/master/sqlServerEditions/sqlServerEditions.model';

export const initialState: IConfigSqlServerEditionsState = {
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

export const configSqlServerEditionsSlice = createSlice({
  name: 'configSqlServerEditions',
  initialState,
  reducers: {
    clearConfigSqlServerEditions: () => {
      return initialState;
    },
    clearConfigSqlServerEditionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigSqlServerEditionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigSqlServerEditions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigSqlServerEditions.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigSqlServerEditions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigSqlServerEditionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigSqlServerEditionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigSqlServerEditions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigSqlServerEditionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigSqlServerEditions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigSqlServerEditions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigSqlServerEditions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigSqlServerEditions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigSqlServerEditions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigSqlServerEditions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configSqlServerEditionsSelector = (state: RootState) => state.configSqlServerEditions;

// Actions
export const {
  clearConfigSqlServerEditions,
  clearConfigSqlServerEditionsMessages,
  clearConfigSqlServerEditionsGetById,
  setTableColumnSelection,
} = configSqlServerEditionsSlice.actions;

// The reducer
export default configSqlServerEditionsSlice.reducer;
