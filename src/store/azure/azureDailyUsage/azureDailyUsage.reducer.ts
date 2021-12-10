import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IAzureDailyUsage } from '../../../services/azure/azureDailyUsage/azureDailyUsage.model';
import { RootState } from '../../app.model';
import {
  searchAzureDailyUsage,
  getAzureDailyUsageById,
  saveAzureDailyUsage,
  deleteAzureDailyUsage,
  processDataAzure,
} from './azureDailyUsage.action';
import { IAzureDailyUsageState } from './azureDailyUsage.model';

export const initialState: IAzureDailyUsageState = {
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

export const azureDailyUsageSlice = createSlice({
  name: 'azureDailyUsage',
  initialState,
  reducers: {
    clearAzureDailyUsage: () => {
      return initialState;
    },
    clearAzureDailyUsageMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearAzureDailyUsageGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAzureDailyUsage.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAzureDailyUsage.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IAzureDailyUsage>>
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
    [searchAzureDailyUsage.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAzureDailyUsageById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAzureDailyUsageById.fulfilled.type]: (state, action: PayloadAction<IAzureDailyUsage>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAzureDailyUsageById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAzureDailyUsage.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAzureDailyUsage.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAzureDailyUsage.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAzureDailyUsage.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAzureDailyUsage.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAzureDailyUsage.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataAzure.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataAzure.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataAzure.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const azureDailyUsageSelector = (state: RootState) => state.azureDailyUsage;

// Actions
export const {
  clearAzureDailyUsage,
  clearAzureDailyUsageMessages,
  clearAzureDailyUsageGetById,
  setTableColumnSelection,
} = azureDailyUsageSlice.actions;

// The reducer
export default azureDailyUsageSlice.reducer;
