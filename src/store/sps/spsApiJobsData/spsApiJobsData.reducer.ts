import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app.model';
import { runJobData, searchSpsApiJobsData } from './spsApiJobsData.action';
import { ISpsApiJobsDataState } from './spsApiJobsData.model';
import { IApiResponseBody } from '../../../common/models/common';

export const initialState: ISpsApiJobsDataState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
  },
  runJobData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  tableColumnSelection: {
    id: null,
    table_name: null,
    columns: {},
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

export const spsApiJobsDataSlice = createSlice({
  name: 'spsApiJobsData',
  initialState,
  reducers: {
    clearSpsApiJobsData: () => {
      return initialState;
    },
    clearSpsApiJobsDataMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.runJobData.messages = [];
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Run Job Data
    [runJobData.pending.type]: (state) => {
      state.runJobData.loading = true;
    },
    [runJobData.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.runJobData.loading = false;
      state.runJobData.hasErrors = false;
      state.runJobData.messages = action.payload.messages;
    },
    [runJobData.rejected.type]: (state) => {
      state.runJobData.loading = false;
      state.runJobData.hasErrors = true;
    },

    // Search
    [searchSpsApiJobsData.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiJobsData.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      if (column_selection) {
        state.tableColumnSelection.id = column_selection.id;
        const tableSelectionObj = JSON.parse(column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = table_name;
    },
    [searchSpsApiJobsData.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },
  },
});

// A selector
export const spsApiJobsDataSelector = (state: RootState) => state.spsApiJobsData;

// Actions
export const { clearSpsApiJobsData, setTableColumnSelection, clearSpsApiJobsDataMessages } =
  spsApiJobsDataSlice.actions;

// The reducer
export default spsApiJobsDataSlice.reducer;
