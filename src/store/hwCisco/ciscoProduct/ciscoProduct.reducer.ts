import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICiscoProduct } from '../../../services/hwCisco/ciscoProduct/ciscoProduct.model';
import { RootState } from '../../app.model';
import {
  deleteCiscoProduct,
  getCiscoProductById,
  saveCiscoProduct,
  searchCiscoProduct,
} from './ciscoProduct.action';
import { ICiscoProductState } from './ciscoProduct.model';

export const initialState: ICiscoProductState = {
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

export const ciscoProductSlice = createSlice({
  name: 'ciscoProduct',
  initialState,
  reducers: {
    clearCiscoProduct: () => {
      return initialState;
    },
    clearCiscoProductMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCiscoProductGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCiscoProduct.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCiscoProduct.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICiscoProduct>>
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
    [searchCiscoProduct.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCiscoProductById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCiscoProductById.fulfilled.type]: (state, action: PayloadAction<ICiscoProduct>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCiscoProductById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCiscoProduct.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCiscoProduct.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCiscoProduct.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCiscoProduct.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCiscoProduct.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCiscoProduct.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const ciscoProductSelector = (state: RootState) => state.ciscoProduct;

// Actions
export const {
  clearCiscoProduct,
  clearCiscoProductMessages,
  clearCiscoProductGetById,
  setTableColumnSelection,
} = ciscoProductSlice.actions;

// The reducer
export default ciscoProductSlice.reducer;
