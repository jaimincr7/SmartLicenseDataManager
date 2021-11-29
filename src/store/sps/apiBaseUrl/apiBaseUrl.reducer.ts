import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiBaseUrlState } from './apiBaseUrl.model';
import {
  deleteSpsApiBaseUrl,
  getSpsApiBaseUrlById,
  saveSpsApiBaseUrl,
  searchSpsApiBaseUrl,
} from './apiBaseUrl.action';
import { ISpsApiBaseUrl } from '../../../services/sps/apiBaseUrl/apiBaseUrl.model';

export const initialState: ISpsApiBaseUrlState = {
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

export const spsApiBaseUrlSlice = createSlice({
  name: 'spsApiBaseUrl',
  initialState,
  reducers: {
    clearSpsApiBaseUrl: () => {
      return initialState;
    },
    clearSpsApiBaseUrlMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiBaseUrlGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiBaseUrl.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiBaseUrl.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiBaseUrl.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiBaseUrlById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiBaseUrlById.fulfilled.type]: (state, action: PayloadAction<ISpsApiBaseUrl>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiBaseUrlById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiBaseUrl.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiBaseUrl.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiBaseUrl.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiBaseUrl.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiBaseUrl.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiBaseUrl.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiBaseUrlSelector = (state: RootState) => state.spsApiBaseUrl;

// Actions
export const {
  clearSpsApiBaseUrl,
  clearSpsApiBaseUrlMessages,
  clearSpsApiBaseUrlGetById,
  setTableColumnSelection,
} = spsApiBaseUrlSlice.actions;

// The reducer
export default spsApiBaseUrlSlice.reducer;
