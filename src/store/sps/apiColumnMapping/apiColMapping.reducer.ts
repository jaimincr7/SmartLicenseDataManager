import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, IDropDownOption, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { IAPiColMappingState } from './apiColMapping.model';
import {
  searchApiColMapping,
  getApiColMappingById,
  saveApiColMapping,
  deleteApiColMapping,
  apiColLookups,
  getApiColumn,
} from './apiColMapping.action';
import { IAPIColMapping } from '../../../services/sps/apiColumnMapping/apiColMapping.model';

export const initialState: IAPiColMappingState = {
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
  columnLookups: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  apiColumn: {
    loading: false,
    hasErrors: false,
    data: [],
  },
};

export const apiColMappingSlice = createSlice({
  name: 'apiColMapping',
  initialState,
  reducers: {
    clearApiColMapping: () => {
      return initialState;
    },
    clearApiColMappingMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearApiColMappingGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchApiColMapping.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchApiColMapping.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IAPIColMapping>>
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
    [searchApiColMapping.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getApiColMappingById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getApiColMappingById.fulfilled.type]: (state, action: PayloadAction<IAPIColMapping>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getApiColMappingById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveApiColMapping.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveApiColMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveApiColMapping.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteApiColMapping.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteApiColMapping.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteApiColMapping.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Get column lookups
    [apiColLookups.pending.type]: (state) => {
      state.columnLookups.loading = true;
    },
    [apiColLookups.fulfilled.type]: (state, action: PayloadAction<IDropDownOption[]>) => {
      state.columnLookups.data = action.payload;
      state.columnLookups.loading = false;
      state.columnLookups.hasErrors = false;
    },
    [apiColLookups.rejected.type]: (state) => {
      state.columnLookups.loading = false;
      state.columnLookups.hasErrors = true;
    },

    // Get api column
    [getApiColumn.pending.type]: (state) => {
      state.apiColumn.loading = true;
    },
    [getApiColumn.fulfilled.type]: (state, action: PayloadAction<string[]>) => {
      state.apiColumn.data = action.payload;
      state.apiColumn.loading = false;
      state.apiColumn.hasErrors = false;
    },
    [getApiColumn.rejected.type]: (state) => {
      state.apiColumn.loading = false;
      state.apiColumn.hasErrors = true;
    },
  },
});

// A selector
export const apiColumnMappingSelector = (state: RootState) => state.apiColumnMapping;

// Actions
export const {
  clearApiColMapping,
  clearApiColMappingMessages,
  clearApiColMappingGetById,
  setTableColumnSelection,
} = apiColMappingSlice.actions;

// The reducer
export default apiColMappingSlice.reducer;
