import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IExcelFileMapping } from '../../../services/master/excelFileMapping/excelFileMapping.model';
import { RootState } from '../../app.model';
import {
  deleteExcelFileMapping,
  getExcelFileMappingById,
  saveExcelFileMapping,
  searchExcelFileMapping,
} from './excelFileMapping.action';
import { IExcelFileMappingState } from './excelFileMapping.model';

export const initialState: IExcelFileMappingState = {
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

export const excelFileMappingSlice = createSlice({
  name: 'excelFileMapping',
  initialState,
  reducers: {
    clearExcelFileMapping: () => {
      return initialState;
    },
    clearExcelFileMappingMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearExcelFileMappingGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchExcelFileMapping.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchExcelFileMapping.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IExcelFileMapping>>
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
    [searchExcelFileMapping.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getExcelFileMappingById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getExcelFileMappingById.fulfilled.type]: (state, action: PayloadAction<IExcelFileMapping>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getExcelFileMappingById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveExcelFileMapping.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveExcelFileMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveExcelFileMapping.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteExcelFileMapping.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteExcelFileMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteExcelFileMapping.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const excelFileMappingSelector = (state: RootState) => state.excelFileMapping;

// Actions
export const {
  clearExcelFileMapping,
  clearExcelFileMappingMessages,
  clearExcelFileMappingGetById,
  setTableColumnSelection,
} = excelFileMappingSlice.actions;

// The reducer
export default excelFileMappingSlice.reducer;
