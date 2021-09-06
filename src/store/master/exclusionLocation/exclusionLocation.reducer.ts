import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigExclusionLocationState } from './exclusionLocation.model';
import {
  deleteConfigExclusionLocation,
  getConfigExclusionLocationById,
  saveConfigExclusionLocation,
  searchConfigExclusionLocation,
} from './exclusionLocation.action';
import { IConfigExclusionLocation } from '../../../services/master/exclusionLocation/exclusionLocation.model';

export const initialState: IConfigExclusionLocationState = {
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

export const configExclusionLocationSlice = createSlice({
  name: 'configExclusionLocation',
  initialState,
  reducers: {
    clearConfigExclusionLocation: () => {
      return initialState;
    },
    clearConfigExclusionLocationMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigExclusionLocationGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigExclusionLocation.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigExclusionLocation.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigExclusionLocation.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigExclusionLocationById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigExclusionLocationById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigExclusionLocation>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigExclusionLocationById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigExclusionLocation.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigExclusionLocation.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigExclusionLocation.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigExclusionLocation.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigExclusionLocation.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigExclusionLocation.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configExclusionLocationSelector = (state: RootState) => state.configExclusionLocation;

// Actions
export const {
  clearConfigExclusionLocation,
  clearConfigExclusionLocationMessages,
  clearConfigExclusionLocationGetById,
  setTableColumnSelection,
} = configExclusionLocationSlice.actions;

// The reducer
export default configExclusionLocationSlice.reducer;
