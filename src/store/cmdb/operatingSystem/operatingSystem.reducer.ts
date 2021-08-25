import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { booleanLookup } from '../../../common/constants/common';
import { RootState } from '../../app.model';
import { ICmdbOperatingSystemState } from './operatingSystem.model';
import {
  deleteCmdbOperatingSystem,
  getCmdbOperatingSystemById,
  saveCmdbOperatingSystem,
  searchCmdbOperatingSystem,
} from './operatingSystem.action';
import { ICmdbOperatingSystem } from '../../../services/cmdb/operatingSystem/operatingSystem.model';

export const initialState: ICmdbOperatingSystemState = {
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

export const cmdbOperatingSystemSlice = createSlice({
  name: 'cmdbOperatingSystem',
  initialState,
  reducers: {
    clearCmdbOperatingSystem: () => {
      return initialState;
    },
    clearCmdbOperatingSystemMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmdbOperatingSystemGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmdbOperatingSystem.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmdbOperatingSystem.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchCmdbOperatingSystem.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmdbOperatingSystemById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmdbOperatingSystemById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmdbOperatingSystem>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmdbOperatingSystemById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmdbOperatingSystem.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmdbOperatingSystem.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmdbOperatingSystem.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmdbOperatingSystem.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmdbOperatingSystem.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmdbOperatingSystem.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmdbOperatingSystemSelector = (state: RootState) => state.cmdbOperatingSystem;

// Actions
export const {
  clearCmdbOperatingSystem,
  clearCmdbOperatingSystemMessages,
  clearCmdbOperatingSystemGetById,
  setTableColumnSelection,
} = cmdbOperatingSystemSlice.actions;

// The reducer
export default cmdbOperatingSystemSlice.reducer;
