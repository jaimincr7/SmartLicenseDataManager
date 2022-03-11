import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../common/models/common';
import { IDataTableForImport } from '../../services/bulkImport/bulkImport.model';
import { IDatabaseTable, ITableColumn } from '../../services/common/common.model';
import { RootState } from '../app.model';
import {
  getTablesForImport,
  getTableColumns,
  getExcelColumns,
  bulkInsert,
  getTables,
  saveTableForImport,
  getExcelFileMapping,
  saveExcelFileMapping,
  deleteColumnMapping,
  deleteFileMapping,
  getCSVExcelColumns,
  getExcelFileMappingLookup,
} from './bulkImport.action';
import { IBulkImportState } from './bulkImport.model';

export const initialState: IBulkImportState = {
  getTablesForImport: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  getTables: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  deleteColumnMapping: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  deleteFileMapping: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  saveTableForImport: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  getTableColumns: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  getExcelFileMappingLookup: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  getExcelColumns: {
    loading: false,
    hasErrors: false,
    data: null,
    csvFiles: null,
    progress: null,
  },
  getCSVExcelColumns: {
    loading: false,
    hasErrors: false,
    data: null,
    csvFiles: null,
  },
  bulkInsert: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  getExcelMappingColumns: {
    loading: false,
    messages: [],
    data: [],
  },
  saveExcelFileMapping: {
    loading: false,
    hasErrors: false,
    messages: [],
    data: null,
  },
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
      state.saveTableForImport.messages = [];
      state.saveExcelFileMapping.messages = [];
      state.deleteColumnMapping.messages = [];
      state.deleteFileMapping.messages = [];
    },
    clearDeleteMessages: (state) => {
      state.deleteColumnMapping.messages = [];
      state.deleteFileMapping.messages = [];
    },
    clearGetTableColumns: (state) => {
      state.getTableColumns.data = null;
    },
    clearExcelColumns: (state) => {
      state.getExcelColumns.data = null;
      state.getExcelColumns.csvFiles = [];
    },
    setExcelColumnsProgress: (state, action: PayloadAction<number>) => {
      state.getExcelColumns.progress = action.payload;
    },
    clearSaveExcelData: (state) => {
      state.saveExcelFileMapping.data = null;
    },
    clearCSVExcelColumns: (state) => {
      state.getCSVExcelColumns.data = null;
      state.getCSVExcelColumns.csvFiles = null;
    },
    clearExcelFileMappingMessages: (state) => {
      state.getExcelMappingColumns.messages = [];
    },
    setTableForImport: (state, action: PayloadAction<IDataTableForImport[]>) => {
      state.getTablesForImport.data = action.payload;
    },
  },
  extraReducers: {
    // Get Table Columns
    [getTablesForImport.pending.type]: (state) => {
      state.getTablesForImport.loading = true;
    },
    [getTablesForImport.fulfilled.type]: (state, action: PayloadAction<IDataTableForImport[]>) => {
      state.getTablesForImport.data = action.payload;
      state.getTablesForImport.loading = false;
      state.getTablesForImport.hasErrors = false;
    },
    [getTablesForImport.rejected.type]: (state) => {
      state.getTablesForImport.loading = false;
      state.getTablesForImport.hasErrors = true;
    },

    // Get Table Columns
    [getExcelFileMappingLookup.pending.type]: (state) => {
      state.getExcelFileMappingLookup.loading = true;
    },
    [getExcelFileMappingLookup.fulfilled.type]: (state, action: PayloadAction<any[]>) => {
      state.getExcelFileMappingLookup.data = action.payload;
      state.getExcelFileMappingLookup.loading = false;
      state.getExcelFileMappingLookup.hasErrors = false;
    },
    [getExcelFileMappingLookup.rejected.type]: (state) => {
      state.getExcelFileMappingLookup.loading = false;
      state.getExcelFileMappingLookup.hasErrors = true;
    },

    // Get Table Columns
    [getTables.pending.type]: (state) => {
      state.getTables.loading = true;
    },
    [getTables.fulfilled.type]: (state, action: PayloadAction<IDatabaseTable[]>) => {
      state.getTables.data = action.payload;
      state.getTables.loading = false;
      state.getTables.hasErrors = false;
    },
    [getTables.rejected.type]: (state) => {
      state.getTables.loading = false;
      state.getTables.hasErrors = true;
    },

    // Save Table Column Selection
    [saveTableForImport.pending.type]: (state) => {
      state.saveTableForImport.loading = true;
      state.saveTableForImport.messages = [];
    },
    [saveTableForImport.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveTableForImport.loading = false;
      state.saveTableForImport.hasErrors = false;
      state.saveTableForImport.messages = action.payload.messages;
    },
    [saveTableForImport.rejected.type]: (state) => {
      state.saveTableForImport.loading = false;
      state.saveTableForImport.hasErrors = true;
    },

    // Save Table Column Selection
    [deleteColumnMapping.pending.type]: (state) => {
      state.deleteColumnMapping.loading = true;
      state.deleteColumnMapping.messages = [];
    },
    [deleteColumnMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.deleteColumnMapping.loading = false;
      state.deleteColumnMapping.hasErrors = false;
      state.deleteColumnMapping.messages = action.payload.messages;
    },
    [deleteColumnMapping.rejected.type]: (state) => {
      state.deleteColumnMapping.loading = false;
      state.deleteColumnMapping.hasErrors = true;
    },

    // Save Table Column Selection
    [deleteFileMapping.pending.type]: (state) => {
      state.deleteFileMapping.loading = true;
      state.deleteFileMapping.messages = [];
    },
    [deleteFileMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.deleteFileMapping.loading = false;
      state.deleteFileMapping.hasErrors = false;
      state.deleteFileMapping.messages = action.payload.messages;
    },
    [deleteFileMapping.rejected.type]: (state) => {
      state.deleteFileMapping.loading = false;
      state.deleteFileMapping.hasErrors = true;
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
    [getExcelColumns.fulfilled.type]: (state, action: any) => {
      const { file_details, cvs_files_with_name } = action.payload;
      state.getExcelColumns.data = file_details;
      state.getExcelColumns.csvFiles = cvs_files_with_name;
      state.getExcelColumns.loading = false;
      state.getExcelColumns.hasErrors = false;
    },
    [getExcelColumns.rejected.type]: (state) => {
      state.getExcelColumns.loading = false;
      state.getExcelColumns.hasErrors = true;
    },

    // Get CSV File Columns
    [getCSVExcelColumns.pending.type]: (state) => {
      state.getCSVExcelColumns.loading = true;
    },
    [getCSVExcelColumns.fulfilled.type]: (state, action: any) => {
      const { file_details, cvs_files_with_name } = action.payload;
      state.getCSVExcelColumns.data = file_details;
      state.getCSVExcelColumns.csvFiles = cvs_files_with_name;
      state.getCSVExcelColumns.loading = false;
      state.getCSVExcelColumns.hasErrors = false;
    },
    [getCSVExcelColumns.rejected.type]: (state) => {
      state.getCSVExcelColumns.loading = false;
      state.getCSVExcelColumns.hasErrors = true;
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
    [bulkInsert.rejected.type]: (state) => {
      state.bulkInsert.loading = false;
      state.bulkInsert.hasErrors = true;
    },

    // Get Excel Columns Mapping
    [getExcelFileMapping.pending.type]: (state) => {
      state.getExcelMappingColumns.loading = true;
      state.getExcelMappingColumns.messages = [];
    },
    [getExcelFileMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.getExcelMappingColumns.loading = false;
      state.getExcelMappingColumns.data = action.payload.data;
      state.getExcelMappingColumns.messages = action.payload.messages;
    },
    [getExcelFileMapping.rejected.type]: (state) => {
      state.getExcelMappingColumns.loading = false;
      state.getExcelMappingColumns.data = true;
    },

    // Save Excel File Mapping
    [saveExcelFileMapping.pending.type]: (state) => {
      state.saveExcelFileMapping.loading = true;
      state.saveExcelFileMapping.messages = [];
      state.saveExcelFileMapping.data = null;
    },
    [saveExcelFileMapping.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { data, messages } = action.payload;
      state.saveExcelFileMapping.loading = false;
      state.saveExcelFileMapping.hasErrors = false;
      state.saveExcelFileMapping.messages = messages;
      state.saveExcelFileMapping.data = data;
    },
    [saveExcelFileMapping.rejected.type]: (state) => {
      state.saveExcelFileMapping.loading = false;
      state.saveExcelFileMapping.hasErrors = true;
    },
  },
});

// A selector
export const bulkImportSelector = (state: RootState) => state.bulkImport;

// Actions
export const {
  clearBulkImport,
  clearBulkImportMessages,
  clearExcelColumns,
  setExcelColumnsProgress,
  clearCSVExcelColumns,
  clearGetTableColumns,
  clearDeleteMessages,
  clearSaveExcelData,
  clearExcelFileMappingMessages,
  setTableForImport,
} = bulkImportSlice.actions;

// The reducer
export default bulkImportSlice.reducer;
