import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { IConfigO365Products } from '../../../services/master/configO365Products/configO365Products.model';
import { RootState } from '../../app.model';
import {
  deleteConfigO365Products,
  getConfigO365ProductsById,
  saveConfigO365Products,
  searchConfigO365Products,
} from './configO365Products.action';
import { IConfigO365ProductsState } from './configO365Products.model';

export const initialState: IConfigO365ProductsState = {
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

export const configO365ProductsSlice = createSlice({
  name: 'configO365Products',
  initialState,
  reducers: {
    clearConfigO365Products: () => {
      return initialState;
    },
    clearConfigO365ProductsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigO365ProductsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigO365Products.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigO365Products.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigO365Products.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigO365ProductsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigO365ProductsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigO365Products>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigO365ProductsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigO365Products.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigO365Products.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigO365Products.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigO365Products.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigO365Products.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigO365Products.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configO365ProductsSelector = (state: RootState) => state.configO365Products;

// Actions
export const {
  clearConfigO365Products,
  clearConfigO365ProductsMessages,
  clearConfigO365ProductsGetById,
  setTableColumnSelection,
} = configO365ProductsSlice.actions;

// The reducer
export default configO365ProductsSlice.reducer;
