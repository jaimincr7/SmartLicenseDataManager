import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app.model';
import { ICronState } from './cronViewLog.model';
import { searchCronViewLog } from './cronViewLog.action';

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

export const cronViewLogSlice = createSlice({
  name: 'cronViewLog',
  initialState,
  reducers: {
    clearCronViewLog: () => {
      return initialState;
    },
    clearCronViewLogMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCronViewLogGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCronViewLog.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCronViewLog.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchCronViewLog.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },
  },
});

// A selector
export const cronViewLogSelector = (state: RootState) => state.cronViewLog;

// Actions
export const {
  clearCronViewLog,
  clearCronViewLogMessages,
  clearCronViewLogGetById,
  setTableColumnSelection,
} = cronViewLogSlice.actions;

// The reducer
export default cronViewLogSlice.reducer;
