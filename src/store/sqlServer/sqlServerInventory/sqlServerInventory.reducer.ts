import { booleanLookup } from './../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISqlServerInventory } from '../../../services/sqlServer/sqlServerInventory/sqlServerInventory.model';
import { RootState } from '../../app.model';
import {
  deleteSqlServerInventory,
  getSqlServerInventoryById,
  processDataSqlServerInventory,
  saveSqlServerInventory,
  searchSqlServerInventory,
} from './sqlServerInventory.action';
import { ISqlServerInventoryState } from './sqlServerInventory.model';

export const initialState: ISqlServerInventoryState = {
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

export const sqlServerInventorySlice = createSlice({
  name: 'sqlServerInventory',
  initialState,
  reducers: {
    clearSqlServerInventory: () => {
      return initialState;
    },
    clearSqlServerInventoryMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearSqlServerInventoryGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerInventory.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerInventory>>
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
    [searchSqlServerInventory.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerInventoryById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerInventoryById.fulfilled.type]: (
      state,
      action: PayloadAction<ISqlServerInventory>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerInventoryById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerInventory.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerInventory.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSqlServerInventory.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerInventory.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataSqlServerInventory.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataSqlServerInventory.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataSqlServerInventory.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const sqlServerInventorySelector = (state: RootState) => state.sqlServerInventory;

// Actions
export const {
  clearSqlServerInventory,
  clearSqlServerInventoryMessages,
  clearSqlServerInventoryGetById,
  setTableColumnSelection,
} = sqlServerInventorySlice.actions;

// The reducer
export default sqlServerInventorySlice.reducer;
