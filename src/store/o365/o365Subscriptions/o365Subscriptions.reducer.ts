import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import {
  deleteO365Subscriptions,
  getO365SubscriptionsById,
  saveO365Subscriptions,
  searchO365Subscriptions,
} from './o365Subscriptions.action';
import { IO365SubscriptionsState } from './o365Subscriptions.model';
import { IO365Subscriptions } from '../../../services/o365/o365Subscriptions/o365Subscriptions.model';

export const initialState: IO365SubscriptionsState = {
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

export const o365SubscriptionsSlice = createSlice({
  name: 'o365Subscriptions',
  initialState,
  reducers: {
    clearO365Subscriptions: () => {
      return initialState;
    },
    clearO365SubscriptionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365SubscriptionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365Subscriptions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365Subscriptions.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365Subscriptions>>
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
    [searchO365Subscriptions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365SubscriptionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365SubscriptionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IO365Subscriptions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365SubscriptionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365Subscriptions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365Subscriptions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365Subscriptions.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteO365Subscriptions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365Subscriptions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365Subscriptions.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },
  },
});

// A selector
export const o365SubscriptionsSelector = (state: RootState) => state.o365Subscriptions;

// Actions
export const {
  clearO365Subscriptions,
  clearO365SubscriptionsMessages,
  clearO365SubscriptionsGetById,
  setTableColumnSelection,
} = o365SubscriptionsSlice.actions;

// The reducer
export default o365SubscriptionsSlice.reducer;
