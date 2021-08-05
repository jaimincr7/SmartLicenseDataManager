import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISqlServerPricing } from '../../../services/sqlServer/sqlServerPricing/sqlServerPricing.model';
import { RootState } from '../../app.model';
import {
  searchSqlServerPricing,
  getSqlServerPricingById,
  saveSqlServerPricing,
  deleteSqlServerPricing,
} from './sqlServerPricing.action';
import { ISqlServerPricingState } from './sqlServerPricing.model';

export const initialState: ISqlServerPricingState = {
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

export const sqlServerPricingSlice = createSlice({
  name: 'sqlServerPricing',
  initialState,
  reducers: {
    clearSqlServerPricing: () => {
      return initialState;
    },
    clearSqlServerPricingMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSqlServerPricingGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerPricing.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerPricing.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerPricing>>
    ) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
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
    [searchSqlServerPricing.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSqlServerPricingById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerPricingById.fulfilled.type]: (state, action: PayloadAction<ISqlServerPricing>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerPricingById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerPricing.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerPricing.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerPricing.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSqlServerPricing.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerPricing.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerPricing.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },
  },
});

// A selector
export const sqlServerPricingSelector = (state: RootState) => state.sqlServerPricing;

// Actions
export const {
  clearSqlServerPricing,
  clearSqlServerPricingMessages,
  clearSqlServerPricingGetById,
  setTableColumnSelection,
} = sqlServerPricingSlice.actions;

// The reducer
export default sqlServerPricingSlice.reducer;
