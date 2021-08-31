import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISearchAPI } from '../../../services/sps/spsApi/sps.model';
import { RootState } from '../../app.model';
import { callApi, searchImportAPIs } from './spsApi.action';
import { ISPSApiState } from './spsApi.model';

export const initialState: ISPSApiState = {
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
  callApi: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const spsApiSlice = createSlice({
  name: 'spsApi',
  initialState,
  reducers: {
    clearSPS: () => {
      return initialState;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
    clearCallApiMessages: (state) => {
      state.callApi.messages = [];
    },
  },

  extraReducers: {
    // Search import apis
    [searchImportAPIs.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchImportAPIs.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISearchAPI>>
    ) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
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
    [searchImportAPIs.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Call API
    [callApi.pending.type]: (state) => {
      state.callApi.loading = true;
    },
    [callApi.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.callApi.loading = false;
      state.callApi.hasErrors = false;
      state.callApi.messages = action.payload.messages;
    },
    [callApi.rejected.type]: (state) => {
      state.callApi.loading = false;
      state.callApi.hasErrors = true;
    },
  },
});

// A selector
export const spsApiSelector = (state: RootState) => state.spsApi;

// Actions
export const { clearSPS, setTableColumnSelection, clearCallApiMessages } = spsApiSlice.actions;

// The reducer
export default spsApiSlice.reducer;
