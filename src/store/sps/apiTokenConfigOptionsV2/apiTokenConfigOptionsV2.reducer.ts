import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiTokenConfigOptionsV2State } from './apiTokenConfigOptionsV2.model';
import {
  deleteSpsApiTokenConfigOptionsV2,
  getSpsApiTokenConfigOptionsV2ById,
  saveSpsApiTokenConfigOptionsV2,
  searchSpsApiTokenConfigOptionsV2,
} from './apiTokenConfigOptionsV2.action';
import { ISpsApiTokenConfigOptionsV2 } from '../../../services/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.model';

export const initialState: ISpsApiTokenConfigOptionsV2State = {
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

export const spsApiTokenConfigOptionsV2Slice = createSlice({
  name: 'spsApiTokenConfigOptionsV2',
  initialState,
  reducers: {
    clearSpsApiTokenConfigOptionsV2: () => {
      return initialState;
    },
    clearSpsApiTokenConfigOptionsV2Messages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiTokenConfigOptionsV2GetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiTokenConfigOptionsV2.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiTokenConfigOptionsV2.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiTokenConfigOptionsV2.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiTokenConfigOptionsV2ById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiTokenConfigOptionsV2ById.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiTokenConfigOptionsV2>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiTokenConfigOptionsV2ById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiTokenConfigOptionsV2.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiTokenConfigOptionsV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiTokenConfigOptionsV2.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiTokenConfigOptionsV2.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiTokenConfigOptionsV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiTokenConfigOptionsV2.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiTokenConfigOptionsV2Selector = (state: RootState) =>
  state.spsApiTokenConfigOptionsV2;

// Actions
export const {
  clearSpsApiTokenConfigOptionsV2,
  clearSpsApiTokenConfigOptionsV2Messages,
  clearSpsApiTokenConfigOptionsV2GetById,
  setTableColumnSelection,
} = spsApiTokenConfigOptionsV2Slice.actions;

// The reducer
export default spsApiTokenConfigOptionsV2Slice.reducer;
