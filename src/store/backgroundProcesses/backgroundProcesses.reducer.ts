import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBackgroundProcessesState } from './backgroundProcesses.model';
import {
  deleteBackgroundProcesses,
  getBackgroundProcessesById,
  searchBackgroundProcesses,
} from './backgroundProcesses.action';
import { IBackgroundProcesses } from '../../services/backgroundProcesses/backgroundProcesses.model';
import { IApiResponseBody } from '../../common/models/common';
import { RootState } from '../app.model';

export const initialState: IBackgroundProcessesState = {
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
  delete: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const backgroundProcessesSlice = createSlice({
  name: 'backgroundProcesses',
  initialState,
  reducers: {
    clearBackgroundProcesses: () => {
      return initialState;
    },
    clearBackgroundProcessesMessages: (state) => {
      state.delete.messages = [];
    },
    clearBackgroundProcessesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchBackgroundProcesses.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchBackgroundProcesses.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchBackgroundProcesses.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getBackgroundProcessesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getBackgroundProcessesById.fulfilled.type]: (
      state,
      action: PayloadAction<IBackgroundProcesses>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getBackgroundProcessesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Delete
    [deleteBackgroundProcesses.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteBackgroundProcesses.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteBackgroundProcesses.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const backgroundProcessesSelector = (state: RootState) => state.backgroundProcesses;

// Actions
export const {
  clearBackgroundProcesses,
  clearBackgroundProcessesMessages,
  clearBackgroundProcessesGetById,
  setTableColumnSelection,
} = backgroundProcessesSlice.actions;

// The reducer
export default backgroundProcessesSlice.reducer;
