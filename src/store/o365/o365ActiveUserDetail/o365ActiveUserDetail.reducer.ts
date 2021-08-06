import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IO365ActiveUserDetail } from '../../../services/o365/o365ActiveUserDetail/o365ActiveUserDetail.model';
import { RootState } from '../../app.model';
import {
  deleteO365ActiveUserDetail,
  getO365ActiveUserDetailById,
  saveO365ActiveUserDetail,
  searchO365ActiveUserDetail,
} from './o365ActiveUserDetail.action';
import { IO365ActiveUserDetailState } from './o365ActiveUserDetail.model';

export const initialState: IO365ActiveUserDetailState = {
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

export const o365ActiveUserDetailSlice = createSlice({
  name: 'o365ActiveUserDetail',
  initialState,
  reducers: {
    clearO365ActiveUserDetail: () => {
      return initialState;
    },
    clearO365ActiveUserDetailMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365ActiveUserDetailGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365ActiveUserDetail.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365ActiveUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365ActiveUserDetail>>
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
    [searchO365ActiveUserDetail.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365ActiveUserDetailById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365ActiveUserDetailById.fulfilled.type]: (
      state,
      action: PayloadAction<IO365ActiveUserDetail>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365ActiveUserDetailById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365ActiveUserDetail.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365ActiveUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365ActiveUserDetail.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365ActiveUserDetail.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365ActiveUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365ActiveUserDetail.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365ActiveUserDetailSelector = (state: RootState) => state.o365ActiveUserDetail;

// Actions
export const {
  clearO365ActiveUserDetail,
  clearO365ActiveUserDetailMessages,
  clearO365ActiveUserDetailGetById,
  setTableColumnSelection,
} = o365ActiveUserDetailSlice.actions;

// The reducer
export default o365ActiveUserDetailSlice.reducer;
