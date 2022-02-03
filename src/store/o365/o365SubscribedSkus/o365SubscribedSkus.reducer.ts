import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import {
  deleteO365SubscribedSkus,
  getO365SubscribedSkusById,
  saveO365SubscribedSkus,
  searchO365SubscribedSkus,
} from './o365SubscribedSkus.action';
import { IO365SubscribedSkusState } from './o365SubscribedSkus.model';
import { IO365SubscribedSkus } from '../../../services/o365/o365SubscribedSkus/o365SubscribedSkus.model';

export const initialState: IO365SubscribedSkusState = {
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

export const o365SubscribedSkusSlice = createSlice({
  name: 'o365SubscribedSkus',
  initialState,
  reducers: {
    clearO365SubscribedSkus: () => {
      return initialState;
    },
    clearO365SubscribedSkusMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365SubscribedSkusGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365SubscribedSkus.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365SubscribedSkus.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365SubscribedSkus>>
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
    [searchO365SubscribedSkus.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365SubscribedSkusById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365SubscribedSkusById.fulfilled.type]: (
      state,
      action: PayloadAction<IO365SubscribedSkus>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365SubscribedSkusById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365SubscribedSkus.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365SubscribedSkus.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365SubscribedSkus.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365SubscribedSkus.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365SubscribedSkus.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365SubscribedSkus.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365SubscribedSkusSelector = (state: RootState) => state.o365SubscribedSkus;

// Actions
export const {
  clearO365SubscribedSkus,
  clearO365SubscribedSkusMessages,
  clearO365SubscribedSkusGetById,
  setTableColumnSelection,
} = o365SubscribedSkusSlice.actions;

// The reducer
export default o365SubscribedSkusSlice.reducer;
