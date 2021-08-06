import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IO365ActivationsUserDetail } from '../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.model';
import { RootState } from '../../app.model';
import {
  deleteO365ActivationsUserDetail,
  getO365ActivationsUserDetailById,
  saveO365ActivationsUserDetail,
  searchO365ActivationsUserDetail,
} from './o365ActivationsUserDetail.action';
import { IO365ActivationsUserDetailState } from './o365ActivationsUserDetail.model';

export const initialState: IO365ActivationsUserDetailState = {
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

export const o365ActivationsUserDetailSlice = createSlice({
  name: 'o365ActivationsUserDetail',
  initialState,
  reducers: {
    clearO365ActivationsUserDetail: () => {
      return initialState;
    },
    clearO365ActivationsUserDetailMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365ActivationsUserDetailGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365ActivationsUserDetail.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365ActivationsUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365ActivationsUserDetail>>
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
    [searchO365ActivationsUserDetail.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365ActivationsUserDetailById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365ActivationsUserDetailById.fulfilled.type]: (
      state,
      action: PayloadAction<IO365ActivationsUserDetail>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365ActivationsUserDetailById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365ActivationsUserDetail.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365ActivationsUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365ActivationsUserDetail.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365ActivationsUserDetail.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365ActivationsUserDetail.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365ActivationsUserDetail.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365ActivationsUserDetailSelector = (state: RootState) =>
  state.o365ActivationsUserDetail;

// Actions
export const {
  clearO365ActivationsUserDetail,
  clearO365ActivationsUserDetailMessages,
  clearO365ActivationsUserDetailGetById,
  setTableColumnSelection,
} = o365ActivationsUserDetailSlice.actions;

// The reducer
export default o365ActivationsUserDetailSlice.reducer;
