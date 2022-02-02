import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiOauthV2State } from './apiOauthV2.model';
import {
  deleteSpsApiOauthV2,
  getSpsApiOauthV2ById,
  saveSpsApiOauthV2,
  searchSpsApiOauthV2,
} from './apiOauthV2.action';
import { ISpsApiOauthV2 } from '../../../services/sps/apiOauthV2/apiOauthV2.model';

export const initialState: ISpsApiOauthV2State = {
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
    data: null,
  },
  delete: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const spsApiOauthV2Slice = createSlice({
  name: 'spsApiOauthV2',
  initialState,
  reducers: {
    clearSpsApiOauthV2: () => {
      return initialState;
    },
    clearSpsApiOauthV2Messages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiOauthV2GetById: (state) => {
      state.getById.data = null;
    },
    clearSpsApiOauthV2Data: (state) => {
      state.save.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiOauthV2.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiOauthV2.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiOauthV2.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiOauthV2ById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiOauthV2ById.fulfilled.type]: (state, action: PayloadAction<ISpsApiOauthV2>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiOauthV2ById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiOauthV2.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiOauthV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
      state.save.data = action.payload.data;
    },
    [saveSpsApiOauthV2.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiOauthV2.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiOauthV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiOauthV2.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiOauthV2Selector = (state: RootState) => state.spsApiOauthV2;

// Actions
export const {
  clearSpsApiOauthV2,
  clearSpsApiOauthV2Messages,
  clearSpsApiOauthV2GetById,
  setTableColumnSelection,
  clearSpsApiOauthV2Data,
} = spsApiOauthV2Slice.actions;

// The reducer
export default spsApiOauthV2Slice.reducer;
