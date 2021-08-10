import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISqlServerOverrides } from '../../../services/sqlServer/sqlServerOverrides/sqlServerOverrides.model';
import { RootState } from '../../app.model';
import {
  searchSqlServerOverrides,
  getSqlServerOverridesById,
  saveSqlServerOverrides,
  deleteSqlServerOverrides,
} from './sqlServerOverrides.action';
import { ISqlServerOverridesState } from './sqlServerOverrides.model';

export const initialState: ISqlServerOverridesState = {
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

export const sqlServerOverridesSlice = createSlice({
  name: 'sqlServerOverrides',
  initialState,
  reducers: {
    clearSqlServerOverrides: () => {
      return initialState;
    },
    clearSqlServerOverridesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSqlServerOverridesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerOverrides.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerOverrides>>
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
    [searchSqlServerOverrides.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerOverridesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerOverridesById.fulfilled.type]: (
      state,
      action: PayloadAction<ISqlServerOverrides>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerOverridesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerOverrides.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerOverrides.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSqlServerOverrides.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerOverrides.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerOverrides.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const sqlServerOverridesSelector = (state: RootState) => state.sqlServerOverrides;

// Actions
export const {
  clearSqlServerOverrides,
  clearSqlServerOverridesMessages,
  clearSqlServerOverridesGetById,
  setTableColumnSelection,
} = sqlServerOverridesSlice.actions;

// The reducer
export default sqlServerOverridesSlice.reducer;
