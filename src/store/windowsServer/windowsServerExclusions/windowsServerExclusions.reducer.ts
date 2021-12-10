import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import {
  deleteWindowsServerExclusions,
  getWindowsFieldLookup,
  getWindowsServerExclusionsById,
  processDataWindowsServerExclusion,
  saveWindowsServerExclusions,
  searchWindowsServerExclusions,
} from './windowsServerExclusions.action';
import { IWindowsServerExclusionsState } from './windowsServerExclusions.model';
import { IWindowsServerExclusions } from '../../../services/windowsServer/windowsServerExclusions/windowsServerExclusions.model';
import { ILookup } from '../../../services/common/common.model';

export const initialState: IWindowsServerExclusionsState = {
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
  fieldLookup: {
    data: [],
    loading: false,
  },
  delete: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  processData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const windowsServerExclusionsSlice = createSlice({
  name: 'windowsServerExclusions',
  initialState,
  reducers: {
    clearWindowsServerExclusions: () => {
      return initialState;
    },
    clearWindowsServerExclusionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearWindowsServerExclusionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerExclusions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerExclusions>>
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
    [searchWindowsServerExclusions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerExclusionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerExclusionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerExclusions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerExclusionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    //Field Lookoup
    [getWindowsFieldLookup.pending.type]: (state) => {
      state.fieldLookup.loading = true;
    },
    [getWindowsFieldLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.fieldLookup.data = action.payload;
      state.fieldLookup.loading = false;
    },

    // Save
    [saveWindowsServerExclusions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerExclusions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteWindowsServerExclusions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerExclusions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataWindowsServerExclusion.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataWindowsServerExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataWindowsServerExclusion.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const windowsServerExclusionsSelector = (state: RootState) => state.windowsServerExclusions;

// Actions
export const {
  clearWindowsServerExclusions,
  clearWindowsServerExclusionsMessages,
  clearWindowsServerExclusionsGetById,
  setTableColumnSelection,
} = windowsServerExclusionsSlice.actions;

// The reducer
export default windowsServerExclusionsSlice.reducer;
