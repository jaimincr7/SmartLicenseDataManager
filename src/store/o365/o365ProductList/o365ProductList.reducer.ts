import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import {
  deleteO365ProductList,
  getO365ProductListById,
  saveO365ProductList,
  searchO365ProductList,
} from './o365ProductList.action';
import { IO365ProductListState } from './o365ProductList.model';
import { IO365ProductList } from '../../../services/o365/o365ProductList/o365ProductList.model';

export const initialState: IO365ProductListState = {
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

export const o365ProductListSlice = createSlice({
  name: 'o365ProductList',
  initialState,
  reducers: {
    clearO365ProductList: () => {
      return initialState;
    },
    clearO365ProductListMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365ProductListGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365ProductList.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365ProductList.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365ProductList>>
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
    [searchO365ProductList.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365ProductListById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365ProductListById.fulfilled.type]: (state, action: PayloadAction<IO365ProductList>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365ProductListById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365ProductList.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365ProductList.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365ProductList.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365ProductList.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365ProductList.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365ProductList.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365ProductListSelector = (state: RootState) => state.o365ProductList;

// Actions
export const {
  clearO365ProductList,
  clearO365ProductListMessages,
  clearO365ProductListGetById,
  setTableColumnSelection,
} = o365ProductListSlice.actions;

// The reducer
export default o365ProductListSlice.reducer;
