import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigSqlServerServicesState } from './sqlServerServices.model';
import {
  deleteConfigSqlServerServices,
  getConfigSqlServerServicesById,
  saveConfigSqlServerServices,
  searchConfigSqlServerServices,
} from './sqlServerServices.action';
import { IConfigSqlServerServices } from '../../../services/master/sqlServerServices/sqlServerServices.model';

export const initialState: IConfigSqlServerServicesState = {
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

export const configSqlServerServicesSlice = createSlice({
  name: 'configSqlServerServices',
  initialState,
  reducers: {
    clearConfigSqlServerServices: () => {
      return initialState;
    },
    clearConfigSqlServerServicesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigSqlServerServicesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigSqlServerServices.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigSqlServerServices.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigSqlServerServices.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigSqlServerServicesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigSqlServerServicesById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigSqlServerServices>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigSqlServerServicesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigSqlServerServices.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigSqlServerServices.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigSqlServerServices.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigSqlServerServices.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigSqlServerServices.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigSqlServerServices.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configSqlServerServicesSelector = (state: RootState) => state.configSqlServerServices;

// Actions
export const {
  clearConfigSqlServerServices,
  clearConfigSqlServerServicesMessages,
  clearConfigSqlServerServicesGetById,
  setTableColumnSelection,
} = configSqlServerServicesSlice.actions;

// The reducer
export default configSqlServerServicesSlice.reducer;
