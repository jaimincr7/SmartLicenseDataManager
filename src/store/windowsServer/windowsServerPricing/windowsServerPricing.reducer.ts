import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { IWindowsServerPricing } from '../../../services/windowsServer/windowsServerPricing/windowsServerPricing.model';
import { RootState } from '../../app.model';
import {
  searchWindowsServerPricing,
  getWindowsServerPricingById,
  saveWindowsServerPricing,
  deleteWindowsServerPricing,
} from './windowsServerPricing.action';
import { IWindowsServerPricingState } from './windowsServerPricing.model';

export const initialState: IWindowsServerPricingState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
    currency_id: null,
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

export const windowsServerPricingSlice = createSlice({
  name: 'windowsServerPricing',
  initialState,
  reducers: {
    clearWindowsServerPricing: () => {
      return initialState;
    },
    clearWindowsServerPricingMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearWindowsServerPricingGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerPricing.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerPricing.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { search_result, current_user_currency_id, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
        state.search.currency_id = current_user_currency_id;
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
    [searchWindowsServerPricing.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerPricingById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerPricingById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerPricing>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerPricingById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveWindowsServerPricing.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerPricing.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerPricing.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteWindowsServerPricing.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerPricing.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerPricing.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const windowsServerPricingSelector = (state: RootState) => state.windowsServerPricing;

// Actions
export const {
  clearWindowsServerPricing,
  clearWindowsServerPricingMessages,
  clearWindowsServerPricingGetById,
  setTableColumnSelection,
} = windowsServerPricingSlice.actions;

// The reducer
export default windowsServerPricingSlice.reducer;
