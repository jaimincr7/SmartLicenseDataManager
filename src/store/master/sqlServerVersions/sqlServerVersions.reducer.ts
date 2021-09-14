import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigSqlServerVersionsState } from './sqlServerVersions.model';
import {
  deleteConfigSqlServerVersions,
  getConfigSqlServerVersionsById,
  saveConfigSqlServerVersions,
  searchConfigSqlServerVersions,
} from './sqlServerVersions.action';
import { IConfigSqlServerVersions } from '../../../services/master/sqlServerVersions/sqlServerVersions.model';

export const initialState: IConfigSqlServerVersionsState = {
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

export const configSqlServerVersionsSlice = createSlice({
  name: 'configSqlServerVersions',
  initialState,
  reducers: {
    clearConfigSqlServerVersions: () => {
      return initialState;
    },
    clearConfigSqlServerVersionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigSqlServerVersionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigSqlServerVersions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigSqlServerVersions.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigSqlServerVersions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigSqlServerVersionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigSqlServerVersionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigSqlServerVersions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigSqlServerVersionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigSqlServerVersions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigSqlServerVersions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigSqlServerVersions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigSqlServerVersions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigSqlServerVersions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigSqlServerVersions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configSqlServerVersionsSelector = (state: RootState) => state.configSqlServerVersions;

// Actions
export const {
  clearConfigSqlServerVersions,
  clearConfigSqlServerVersionsMessages,
  clearConfigSqlServerVersionsGetById,
  setTableColumnSelection,
} = configSqlServerVersionsSlice.actions;

// The reducer
export default configSqlServerVersionsSlice.reducer;
