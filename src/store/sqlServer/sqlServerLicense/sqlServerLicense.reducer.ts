import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISqlServerLicense } from '../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';
import { RootState } from '../../app.model';
import {
  deleteSqlServerLicense,
  getSqlServerLicenseById,
  reRunAllScenarios,
  saveSqlServerLicense,
  searchSqlServerLicense,
} from './sqlServerLicense.action';
import { ISqlServerLicenseState } from './sqlServerLicense.model';

export const initialState: ISqlServerLicenseState = {
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
  reRunAllScenarios: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const sqlServerLicenseSlice = createSlice({
  name: 'sqlServerLicense',
  initialState,
  reducers: {
    clearSqlServerLicense: () => {
      return initialState;
    },
    clearSqlServerLicenseMessages: (state) => {
      state.save.messages = [];
      state.reRunAllScenarios.messages = [];
      state.delete.messages = [];
    },
    clearSqlServerLicenseGetById: (state) => {
      state.getById.data = null;
    },
    clearSqlServerLicenseReRunAllScenariosMessages: (state) => {
      state.reRunAllScenarios.messages = [];
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerLicense.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerLicense>>
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
    [searchSqlServerLicense.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerLicenseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerLicenseById.fulfilled.type]: (state, action: PayloadAction<ISqlServerLicense>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerLicenseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerLicense.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerLicense.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSqlServerLicense.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerLicense.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Re-run all scenario
    [reRunAllScenarios.pending.type]: (state) => {
      state.reRunAllScenarios.loading = true;
      state.reRunAllScenarios.messages = [];
    },
    [reRunAllScenarios.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.reRunAllScenarios.loading = false;
      state.reRunAllScenarios.hasErrors = false;
      state.reRunAllScenarios.messages = action.payload.messages;
    },
    [reRunAllScenarios.rejected.type]: (state) => {
      state.reRunAllScenarios.loading = false;
      state.reRunAllScenarios.hasErrors = true;
    },
  },
});

// A selector
export const sqlServerLicenseSelector = (state: RootState) => state.sqlServerLicense;

// Actions
export const {
  clearSqlServerLicense,
  clearSqlServerLicenseMessages,
  clearSqlServerLicenseGetById,
  clearSqlServerLicenseReRunAllScenariosMessages,
  setTableColumnSelection,
} = sqlServerLicenseSlice.actions;

// The reducer
export default sqlServerLicenseSlice.reducer;
