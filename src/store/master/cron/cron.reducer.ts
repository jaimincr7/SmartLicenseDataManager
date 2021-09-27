import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICron } from '../../../services/master/cron/cron.model';
import { RootState } from '../../app.model';
import { searchCron, startApi } from './cron.action';
import { ICronState } from './cron.model';

export const initialState: ICronState = {
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

export const cronSlice = createSlice({
  name: 'cron',
  initialState,
  reducers: {
    clearCron: () => {
      return initialState;
    },
    clearCronMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCronGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCron.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCron.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<ICron>>) => {
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
    [searchCron.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },
  },

  // Save
  [startApi.pending.type]: (state) => {
    state.save.loading = true;
    state.save.messages = [];
  },
  [startApi.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
    state.save.loading = false;
    state.save.hasErrors = false;
    state.save.messages = action.payload.messages;
  },
  [startApi.rejected.type]: (state) => {
    state.save.loading = false;
    state.save.hasErrors = true;
  },

});

// A selector
export const cronSelector = (state: RootState) => state.cron;

// Actions
export const { clearCron, clearCronMessages, clearCronGetById, setTableColumnSelection } =
  cronSlice.actions;

// The reducer
export default cronSlice.reducer;
