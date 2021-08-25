import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmdbProcessorState } from './processor.model';
import {
  deleteCmdbProcessor,
  getCmdbProcessorById,
  saveCmdbProcessor,
  searchCmdbProcessor,
} from './processor.action';
import { ICmdbProcessor } from '../../../services/cmdb/processor/processor.model';

export const initialState: ICmdbProcessorState = {
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

export const cmdbProcessorSlice = createSlice({
  name: 'cmdbProcessor',
  initialState,
  reducers: {
    clearCmdbProcessor: () => {
      return initialState;
    },
    clearCmdbProcessorMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmdbProcessorGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmdbProcessor.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmdbProcessor.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
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
    [searchCmdbProcessor.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmdbProcessorById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmdbProcessorById.fulfilled.type]: (state, action: PayloadAction<ICmdbProcessor>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmdbProcessorById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmdbProcessor.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmdbProcessor.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmdbProcessor.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmdbProcessor.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmdbProcessor.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmdbProcessor.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmdbProcessorSelector = (state: RootState) => state.cmdbProcessor;

// Actions
export const {
  clearCmdbProcessor,
  clearCmdbProcessorMessages,
  clearCmdbProcessorGetById,
  setTableColumnSelection,
} = cmdbProcessorSlice.actions;

// The reducer
export default cmdbProcessorSlice.reducer;
