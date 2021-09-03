import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigComponentTableColumnState } from './componentTableColumn.model';
import {
  deleteConfigComponentTableColumn,
  getConfigComponentTableColumnById,
  saveConfigComponentTableColumn,
  searchConfigComponentTableColumn,
} from './componentTableColumn.action';
import { IConfigComponentTableColumn } from '../../../services/master/componentTableColumn/componentTableColumn.model';

export const initialState: IConfigComponentTableColumnState = {
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

export const configComponentTableColumnSlice = createSlice({
  name: 'configComponentTableColumn',
  initialState,
  reducers: {
    clearConfigComponentTableColumn: () => {
      return initialState;
    },
    clearConfigComponentTableColumnMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigComponentTableColumnGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigComponentTableColumn.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigComponentTableColumn.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigComponentTableColumn.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigComponentTableColumnById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigComponentTableColumnById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigComponentTableColumn>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigComponentTableColumnById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigComponentTableColumn.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigComponentTableColumn.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigComponentTableColumn.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigComponentTableColumn.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigComponentTableColumn.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigComponentTableColumn.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configComponentTableColumnSelector = (state: RootState) =>
  state.configComponentTableColumn;

// Actions
export const {
  clearConfigComponentTableColumn,
  clearConfigComponentTableColumnMessages,
  clearConfigComponentTableColumnGetById,
  setTableColumnSelection,
} = configComponentTableColumnSlice.actions;

// The reducer
export default configComponentTableColumnSlice.reducer;
