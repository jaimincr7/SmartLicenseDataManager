import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigWindowsServerVersionsState } from './windowsServerVersions.model';
import {
  deleteConfigWindowsServerVersions,
  getConfigWindowsServerVersionsById,
  saveConfigWindowsServerVersions,
  searchConfigWindowsServerVersions,
} from './windowsServerVersions.action';
import { IConfigWindowsServerVersions } from '../../../services/master/windowsServerVersions/windowsServerVersions.model';

export const initialState: IConfigWindowsServerVersionsState = {
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

export const configWindowsServerVersionsSlice = createSlice({
  name: 'configWindowsServerVersions',
  initialState,
  reducers: {
    clearConfigWindowsServerVersions: () => {
      return initialState;
    },
    clearConfigWindowsServerVersionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigWindowsServerVersionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigWindowsServerVersions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigWindowsServerVersions.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigWindowsServerVersions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigWindowsServerVersionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigWindowsServerVersionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigWindowsServerVersions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigWindowsServerVersionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigWindowsServerVersions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigWindowsServerVersions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigWindowsServerVersions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigWindowsServerVersions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigWindowsServerVersions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigWindowsServerVersions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configWindowsServerVersionsSelector = (state: RootState) =>
  state.configWindowsServerVersions;

// Actions
export const {
  clearConfigWindowsServerVersions,
  clearConfigWindowsServerVersionsMessages,
  clearConfigWindowsServerVersionsGetById,
  setTableColumnSelection,
} = configWindowsServerVersionsSlice.actions;

// The reducer
export default configWindowsServerVersionsSlice.reducer;
