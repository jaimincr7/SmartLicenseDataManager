import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiOauthState } from './apiOauth.model';
import {
  deleteSpsApiOauth,
  getSpsApiOauthById,
  saveSpsApiOauth,
  searchSpsApiOauth,
} from './apiOauth.action';
import { ISpsApiOauth } from '../../../services/sps/apiOauth/apiOauth.model';

export const initialState: ISpsApiOauthState = {
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

export const spsApiOauthSlice = createSlice({
  name: 'spsApiOauth',
  initialState,
  reducers: {
    clearSpsApiOauth: () => {
      return initialState;
    },
    clearSpsApiOauthMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiOauthGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiOauth.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiOauth.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiOauth.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiOauthById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiOauthById.fulfilled.type]: (state, action: PayloadAction<ISpsApiOauth>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiOauthById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiOauth.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiOauth.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiOauth.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiOauth.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiOauth.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiOauth.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiOauthSelector = (state: RootState) => state.spsApiOauth;

// Actions
export const {
  clearSpsApiOauth,
  clearSpsApiOauthMessages,
  clearSpsApiOauthGetById,
  setTableColumnSelection,
} = spsApiOauthSlice.actions;

// The reducer
export default spsApiOauthSlice.reducer;
