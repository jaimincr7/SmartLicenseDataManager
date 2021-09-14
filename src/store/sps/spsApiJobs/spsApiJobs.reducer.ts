import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISpsApiJobs } from '../../../services/sps/spsApiJobs/spsApiJobs.model';
import { RootState } from '../../app.model';
import {
  deleteSpsApiJobs,
  getSpsApiJobsById,
  saveSpsApiJobs,
  searchSpsApiJobs,
} from './spsApiJobs.action';
import { ISpsApiJobsState } from './spsApiJobs.model';

export const initialState: ISpsApiJobsState = {
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
  reRunAllScenarios: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const spsApiJobsSlice = createSlice({
  name: 'spsApiJobs',
  initialState,
  reducers: {
    clearSpsApiJobs: () => {
      return initialState;
    },
    clearSpsApiJobsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiJobsGetById: (state) => {
      state.getById.data = null;
    },
    clearSpsApiJobsReRunAllScenariosMessages: (state) => {
      state.reRunAllScenarios.messages = [];
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiJobs.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiJobs.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISpsApiJobs>>
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
    [searchSpsApiJobs.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiJobsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiJobsById.fulfilled.type]: (state, action: PayloadAction<ISpsApiJobs>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiJobsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiJobs.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiJobs.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiJobs.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiJobs.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiJobs.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiJobs.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiJobsSelector = (state: RootState) => state.spsApiJobs;

// Actions
export const {
  clearSpsApiJobs,
  clearSpsApiJobsMessages,
  clearSpsApiJobsGetById,
  clearSpsApiJobsReRunAllScenariosMessages,
  setTableColumnSelection,
} = spsApiJobsSlice.actions;

// The reducer
export default spsApiJobsSlice.reducer;
