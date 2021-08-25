import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsPurchaseLineItemState } from './purchaseLineItem.model';
import {
  deleteCmsPurchaseLineItem,
  getCmsPurchaseLineItemById,
  saveCmsPurchaseLineItem,
  searchCmsPurchaseLineItem,
} from './purchaseLineItem.action';
import { ICmsPurchaseLineItem } from '../../../services/cms/purchaseLineItem/purchaseLineItem.model';

export const initialState: ICmsPurchaseLineItemState = {
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

export const cmsPurchaseLineItemSlice = createSlice({
  name: 'cmsPurchaseLineItem',
  initialState,
  reducers: {
    clearCmsPurchaseLineItem: () => {
      return initialState;
    },
    clearCmsPurchaseLineItemMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsPurchaseLineItemGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsPurchaseLineItem.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsPurchaseLineItem.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICmsPurchaseLineItem>>
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
    [searchCmsPurchaseLineItem.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsPurchaseLineItemById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsPurchaseLineItemById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmsPurchaseLineItem>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsPurchaseLineItemById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsPurchaseLineItem.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsPurchaseLineItem.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsPurchaseLineItem.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsPurchaseLineItem.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsPurchaseLineItem.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsPurchaseLineItem.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsPurchaseLineItemSelector = (state: RootState) => state.cmsPurchaseLineItem;

// Actions
export const {
  clearCmsPurchaseLineItem,
  clearCmsPurchaseLineItemMessages,
  clearCmsPurchaseLineItemGetById,
  setTableColumnSelection,
} = cmsPurchaseLineItemSlice.actions;

// The reducer
export default cmsPurchaseLineItemSlice.reducer;
