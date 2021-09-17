import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiTokenConfigOptionsState } from './apiTokenConfigOptions.model';
import {
  deleteSpsApiTokenConfigOptions,
  getSpsApiTokenConfigOptionsById,
  saveSpsApiTokenConfigOptions,
  searchSpsApiTokenConfigOptions,
} from './apiTokenConfigOptions.action';
import { ISpsApiTokenConfigOptions } from '../../../services/sps/apiTokenConfigOptions/apiTokenConfigOptions.model';

export const initialState: ISpsApiTokenConfigOptionsState = {
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

export const spsApiTokenConfigOptionsSlice = createSlice({
  name: 'spsApiTokenConfigOptions',
  initialState,
  reducers: {
    clearSpsApiTokenConfigOptions: () => {
      return initialState;
    },
    clearSpsApiTokenConfigOptionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiTokenConfigOptionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiTokenConfigOptions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiTokenConfigOptions.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiTokenConfigOptions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiTokenConfigOptionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiTokenConfigOptionsById.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiTokenConfigOptions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiTokenConfigOptionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiTokenConfigOptions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiTokenConfigOptions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiTokenConfigOptions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiTokenConfigOptions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiTokenConfigOptions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiTokenConfigOptions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiTokenConfigOptionsSelector = (state: RootState) =>
  state.spsApiTokenConfigOptions;

// Actions
export const {
  clearSpsApiTokenConfigOptions,
  clearSpsApiTokenConfigOptionsMessages,
  clearSpsApiTokenConfigOptionsGetById,
  setTableColumnSelection,
} = spsApiTokenConfigOptionsSlice.actions;

// The reducer
export default spsApiTokenConfigOptionsSlice.reducer;
