import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { IExcelColumnMapping } from '../../../services/master/excelColumnMapping/excelColumnMapping.model';
import { RootState } from '../../app.model';
import {
  deleteExcelColumnMapping,
  getExcelColumnMappingById,
  saveExcelColumnMapping,
  searchExcelColumnMapping,
} from './excelColumnMapping.action';
import { IExcelColumnMappingState } from './excelColumnMapping.model';

export const initialState: IExcelColumnMappingState = {
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

export const excelColumnMappingSlice = createSlice({
  name: 'excelColumnMapping',
  initialState,
  reducers: {
    clearExcelColumnMapping: () => {
      return initialState;
    },
    clearExcelColumnMappingMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearExcelColumnMappingGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchExcelColumnMapping.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchExcelColumnMapping.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchExcelColumnMapping.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getExcelColumnMappingById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getExcelColumnMappingById.fulfilled.type]: (
      state,
      action: PayloadAction<IExcelColumnMapping>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getExcelColumnMappingById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveExcelColumnMapping.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveExcelColumnMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveExcelColumnMapping.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteExcelColumnMapping.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteExcelColumnMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteExcelColumnMapping.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const excelColumnMappingSelector = (state: RootState) => state.excelColumnMapping;

// Actions
export const {
  clearExcelColumnMapping,
  clearExcelColumnMappingMessages,
  clearExcelColumnMappingGetById,
  setTableColumnSelection,
} = excelColumnMappingSlice.actions;

// The reducer
export default excelColumnMappingSlice.reducer;
