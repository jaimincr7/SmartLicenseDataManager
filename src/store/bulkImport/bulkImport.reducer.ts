import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../common/models/common';
import { IDatabaseTable, IGetExcelColumns, ITableColumn } from '../../services/common/common.model';
import { RootState } from '../app.model';
import {
  getDatabaseTables,
  getTableColumns,
  getExcelColumns,
  bulkInsert
} from './bulkImport.action';
import { IBulkImportState } from './bulkImport.model';

export const initialState: IBulkImportState = {
  getDatabaseTables: {
    loading: false,
    hasErrors: false,
    data: []
  },
  getTableColumns: {
    loading: false,
    hasErrors: false,
    data: []
  },
  getExcelColumns: {
    loading: false,
    hasErrors: false,
    data: null
  },
  bulkInsert: {
    loading: false,
    hasErrors: false,
    messages: []
  }
};

export const bulkImportSlice = createSlice({
  name: 'bulkImport',
  initialState,
  reducers: {
    clearBulkImport: () => {
      return initialState;
    },
    clearBulkImportMessages: (state) => {
      state.bulkInsert.messages = [];
    },
    clearGetTableColumns: (state) => {
      state.getTableColumns.data = null;
    },
    clearExcelColumns: (state) => {
      state.getExcelColumns.data = null;
    },
  },
  extraReducers: {

    // Get Table Columns
    [getDatabaseTables.pending.type]: (state) => {
      state.getDatabaseTables.loading = true;
    },
    [getDatabaseTables.fulfilled.type]: (state, action: PayloadAction<IDatabaseTable[]>) => {
      state.getDatabaseTables.data = action.payload;
      state.getDatabaseTables.loading = false;
      state.getDatabaseTables.hasErrors = false;
    },
    [getDatabaseTables.rejected.type]: (state) => {
      state.getDatabaseTables.loading = false;
      state.getDatabaseTables.hasErrors = true;
    },

    // Get Table Columns
    [getTableColumns.pending.type]: (state) => {
      state.getTableColumns.loading = true;
    },
    [getTableColumns.fulfilled.type]: (state, action: PayloadAction<ITableColumn[]>) => {
      state.getTableColumns.data = action.payload;
      state.getTableColumns.loading = false;
      state.getTableColumns.hasErrors = false;
    },
    [getTableColumns.rejected.type]: (state) => {
      state.getTableColumns.loading = false;
      state.getTableColumns.hasErrors = true;
    },

    // Get Excel Columns
    [getExcelColumns.pending.type]: (state) => {
      state.getExcelColumns.loading = true;
    },
    [getExcelColumns.fulfilled.type]: (state, action: PayloadAction<IGetExcelColumns>) => {
      state.getExcelColumns.data = action.payload;
      state.getExcelColumns.loading = false;
      state.getExcelColumns.hasErrors = false;
    },
    [getExcelColumns.rejected.type]: (state) => {
      state.getExcelColumns.loading = false;
      state.getExcelColumns.hasErrors = true;
    },

    // Bulk Insert
    [bulkInsert.pending.type]: (state) => {
      state.bulkInsert.loading = true;
      state.bulkInsert.messages = [];
    },
    [bulkInsert.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.bulkInsert.loading = false;
      state.bulkInsert.hasErrors = false;
      state.bulkInsert.messages = action.payload.messages;
    },
    [bulkInsert.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.bulkInsert.loading = false;
      state.bulkInsert.hasErrors = true;
      state.bulkInsert.messages = action.payload.errors;
    },
  },
});

// A selector
export const bulkImportSelector = (state: RootState) => state.bulkImport;

// Actions
export const { clearBulkImport, clearBulkImportMessages, clearExcelColumns, clearGetTableColumns } =
  bulkImportSlice.actions;

// The reducer
export default bulkImportSlice.reducer;
