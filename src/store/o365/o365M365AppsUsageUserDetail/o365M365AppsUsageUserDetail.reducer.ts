import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IO365M365AppsUsageUserDetail } from '../../../services/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.model';
import { RootState } from '../../app.model';
import {
  deleteO365M365AppsUsageUserDetail,
  getO365M365AppsUsageUserDetailById,
  saveO365M365AppsUsageUserDetail,
  searchO365M365AppsUsageUserDetail,
} from './o365M365AppsUsageUserDetail.action';
import { IO365M365AppsUsageUserDetailState } from './o365M365AppsUsageUserDetail.model';

export const initialState: IO365M365AppsUsageUserDetailState = {
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

export const o365M365AppsUsageUserDetailSlice = createSlice({
  name: 'o365M365AppsUsageUserDetail',
  initialState,
  reducers: {
    clearO365M365AppsUsageUserDetail: () => {
      return initialState;
    },
    clearO365M365AppsUsageUserDetailMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365M365AppsUsageUserDetailGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365M365AppsUsageUserDetail.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365M365AppsUsageUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365M365AppsUsageUserDetail>>
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
    [searchO365M365AppsUsageUserDetail.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365M365AppsUsageUserDetailById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365M365AppsUsageUserDetailById.fulfilled.type]: (
      state,
      action: PayloadAction<IO365M365AppsUsageUserDetail>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365M365AppsUsageUserDetailById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365M365AppsUsageUserDetail.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365M365AppsUsageUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365M365AppsUsageUserDetail.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365M365AppsUsageUserDetail.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365M365AppsUsageUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365M365AppsUsageUserDetail.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365M365AppsUsageUserDetailSelector = (state: RootState) =>
  state.o365M365AppsUsageUserDetail;

// Actions
export const {
  clearO365M365AppsUsageUserDetail,
  clearO365M365AppsUsageUserDetailMessages,
  clearO365M365AppsUsageUserDetailGetById,
  setTableColumnSelection,
} = o365M365AppsUsageUserDetailSlice.actions;

// The reducer
export default o365M365AppsUsageUserDetailSlice.reducer;
