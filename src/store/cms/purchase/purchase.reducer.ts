import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsPurchaseState } from './purchase.model';
import {
  deleteCmsPurchase,
  getCmsPurchaseById,
  saveCmsPurchase,
  searchCmsPurchase,
} from './purchase.action';
import { ICmsPurchase } from '../../../services/cms/purchase/purchase.model';

export const initialState: ICmsPurchaseState = {
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

export const cmsPurchaseSlice = createSlice({
  name: 'cmsPurchase',
  initialState,
  reducers: {
    clearCmsPurchase: () => {
      return initialState;
    },
    clearCmsPurchaseMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsPurchaseGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsPurchase.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsPurchase.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICmsPurchase>>
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
    [searchCmsPurchase.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsPurchaseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsPurchaseById.fulfilled.type]: (state, action: PayloadAction<ICmsPurchase>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsPurchaseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsPurchase.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsPurchase.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsPurchase.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsPurchase.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsPurchase.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsPurchase.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsPurchaseSelector = (state: RootState) => state.cmsPurchase;

// Actions
export const {
  clearCmsPurchase,
  clearCmsPurchaseMessages,
  clearCmsPurchaseGetById,
  setTableColumnSelection,
} = cmsPurchaseSlice.actions;

// The reducer
export default cmsPurchaseSlice.reducer;
