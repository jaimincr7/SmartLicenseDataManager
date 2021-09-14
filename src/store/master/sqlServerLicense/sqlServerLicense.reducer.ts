import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigSqlServerLicenseState } from './sqlServerLicense.model';
import {
  deleteConfigSqlServerLicense,
  getConfigSqlServerLicenseById,
  saveConfigSqlServerLicense,
  searchConfigSqlServerLicense,
} from './sqlServerLicense.action';
import { IConfigSqlServerLicense } from '../../../services/master/sqlServerLicense/sqlServerLicense.model';

export const initialState: IConfigSqlServerLicenseState = {
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

export const configSqlServerLicenseSlice = createSlice({
  name: 'configSqlServerLicense',
  initialState,
  reducers: {
    clearConfigSqlServerLicense: () => {
      return initialState;
    },
    clearConfigSqlServerLicenseMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigSqlServerLicenseGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigSqlServerLicense.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigSqlServerLicense.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigSqlServerLicense.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigSqlServerLicenseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigSqlServerLicenseById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigSqlServerLicense>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigSqlServerLicenseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigSqlServerLicense.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigSqlServerLicense.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigSqlServerLicense.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigSqlServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigSqlServerLicense.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configSqlServerLicenseSelector = (state: RootState) => state.configSqlServerLicense;

// Actions
export const {
  clearConfigSqlServerLicense,
  clearConfigSqlServerLicenseMessages,
  clearConfigSqlServerLicenseGetById,
  setTableColumnSelection,
} = configSqlServerLicenseSlice.actions;

// The reducer
export default configSqlServerLicenseSlice.reducer;
