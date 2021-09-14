import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigProcessorsState } from './processors.model';
import {
  deleteConfigProcessors,
  getConfigProcessorsById,
  saveConfigProcessors,
  searchConfigProcessors,
} from './processors.action';
import { IConfigProcessors } from '../../../services/master/processors/processors.model';

export const initialState: IConfigProcessorsState = {
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

export const configProcessorsSlice = createSlice({
  name: 'configProcessors',
  initialState,
  reducers: {
    clearConfigProcessors: () => {
      return initialState;
    },
    clearConfigProcessorsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigProcessorsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigProcessors.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigProcessors.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.lookups = { booleanLookup };
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
    [searchConfigProcessors.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigProcessorsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigProcessorsById.fulfilled.type]: (state, action: PayloadAction<IConfigProcessors>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigProcessorsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigProcessors.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigProcessors.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigProcessors.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigProcessors.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigProcessors.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigProcessors.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configProcessorsSelector = (state: RootState) => state.configProcessors;

// Actions
export const {
  clearConfigProcessors,
  clearConfigProcessorsMessages,
  clearConfigProcessorsGetById,
  setTableColumnSelection,
} = configProcessorsSlice.actions;

// The reducer
export default configProcessorsSlice.reducer;
