import { IGlobalTableColumnSelectionState } from './globalTableColumnSelection.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ITableColumnSelection } from '../../../common/models/common';
import { IDatabaseTable, ITableColumn } from '../../../services/common/common.model';
import { RootState } from '../../app.model';
import {
  getDatabaseTables,
  getGlobalTableColumns,
  getTableColumns,
  saveGlobalTableColumnSelection,
} from './globalTableColumnSelection.action';

export const initialState: IGlobalTableColumnSelectionState = {
  getDatabaseTables: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  getGlobalTableColumns: {
    loading: false,
    hasErrors: false,
    data: {
      id: null,
      table_name: null,
      columns: {},
    },
  },
  getTableColumns: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  saveGlobalTableColumnSelection: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const globalTableColumnSelectionSlice = createSlice({
  name: 'globalTableColumnSelection',
  initialState,
  reducers: {
    clearGlobalTableColumnSelection: () => {
      return initialState;
    },
    clearGlobalTableColumnSelectionMessages: (state) => {
      state.saveGlobalTableColumnSelection.messages = [];
    },
    setGlobalTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.getGlobalTableColumns.data.columns = action.payload;
    },
    clearGetTableColumns: (state) => {
      state.getTableColumns.data = null;
    },
    setGlobalTableColumnsTableName: (state, tableName: any) => {
      state.getGlobalTableColumns.data.table_name = tableName;
    },
    setGlobalTableColumns: (state, action: PayloadAction<ITableColumnSelection>) => {
      if (action.payload) {
        const { columns, id, table_name } = action.payload;
        state.getGlobalTableColumns.data.id = id;
        state.getGlobalTableColumns.data.columns = JSON.parse(columns as any);
        state.getGlobalTableColumns.data.table_name = table_name;
      }
    },
    clearGetGlobalTableColumns: (state) => {
      state.getGlobalTableColumns.data = {
        id: null,
        table_name: null,
        columns: {},
      };
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

    // Get Global Table Columns
    [getGlobalTableColumns.pending.type]: (state) => {
      state.getGlobalTableColumns.loading = true;
    },
    [getGlobalTableColumns.fulfilled.type]: (
      state,
      action: PayloadAction<ITableColumnSelection>
    ) => {
      if (action.payload) {
        const { columns, id, table_name } = action.payload;
        if (id) {
          state.getGlobalTableColumns.data.id = id;
          state.getGlobalTableColumns.data.columns = JSON.parse(columns as any);
          state.getGlobalTableColumns.data.table_name = table_name;
        }
      }
      state.getGlobalTableColumns.loading = false;
      state.getGlobalTableColumns.hasErrors = false;
    },
    [getGlobalTableColumns.rejected.type]: (state) => {
      state.getGlobalTableColumns.loading = false;
      state.getGlobalTableColumns.hasErrors = true;
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

    // Save
    [saveGlobalTableColumnSelection.pending.type]: (state) => {
      state.saveGlobalTableColumnSelection.loading = true;
      state.saveGlobalTableColumnSelection.messages = [];
    },
    [saveGlobalTableColumnSelection.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveGlobalTableColumnSelection.loading = false;
      state.saveGlobalTableColumnSelection.hasErrors = false;
      state.saveGlobalTableColumnSelection.messages = action.payload.messages;
    },
    [saveGlobalTableColumnSelection.rejected.type]: (state) => {
      state.saveGlobalTableColumnSelection.loading = false;
      state.saveGlobalTableColumnSelection.hasErrors = true;
    },
  },
});

// A selector
export const globalTableColumnSelectionSelector = (state: RootState) =>
  state.globalTableColumnSelection;

// Actions
export const {
  clearGlobalTableColumnSelection,
  clearGlobalTableColumnSelectionMessages,
  setGlobalTableColumnSelection,
  clearGetTableColumns,
  setGlobalTableColumns,
  setGlobalTableColumnsTableName,
  clearGetGlobalTableColumns,
} = globalTableColumnSelectionSlice.actions;

// The reducer
export default globalTableColumnSelectionSlice.reducer;
