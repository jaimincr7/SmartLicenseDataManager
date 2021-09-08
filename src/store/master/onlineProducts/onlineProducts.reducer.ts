import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigOnlineProductsState } from './onlineProducts.model';
import {
  deleteConfigOnlineProducts,
  getConfigOnlineProductsById,
  saveConfigOnlineProducts,
  searchConfigOnlineProducts,
} from './onlineProducts.action';
import { IConfigOnlineProducts } from '../../../services/master/onlineProducts/onlineProducts.model';

export const initialState: IConfigOnlineProductsState = {
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

export const configOnlineProductsSlice = createSlice({
  name: 'configOnlineProducts',
  initialState,
  reducers: {
    clearConfigOnlineProducts: () => {
      return initialState;
    },
    clearConfigOnlineProductsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigOnlineProductsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigOnlineProducts.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigOnlineProducts.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      if (column_selection) {
        state.tableColumnSelection.id = column_selection.id;
        const tableSelectionObj = JSON.parse(column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = table_name;
    },
    [searchConfigOnlineProducts.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigOnlineProductsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigOnlineProductsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigOnlineProducts>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigOnlineProductsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigOnlineProducts.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigOnlineProducts.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigOnlineProducts.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigOnlineProducts.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigOnlineProducts.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigOnlineProducts.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configOnlineProductsSelector = (state: RootState) => state.configOnlineProducts;

// Actions
export const {
  clearConfigOnlineProducts,
  clearConfigOnlineProductsMessages,
  clearConfigOnlineProductsGetById,
  setTableColumnSelection,
} = configOnlineProductsSlice.actions;

// The reducer
export default configOnlineProductsSlice.reducer;
