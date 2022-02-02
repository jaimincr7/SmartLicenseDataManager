import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ICmdbOsNormalizationState } from './osNormalization.model';
import {
  deleteCmdbOsNormalization,
  getCmdbOsNormalizationById,
  saveCmdbOsNormalization,
  searchCmdbOsNormalization,
} from './osNormalization.action';
import { ICmdbOsNormalization } from '../../../services/cmdb/osNormalization/osNormalization.model';

export const initialState: ICmdbOsNormalizationState = {
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

export const cmdbOsNormalizationSlice = createSlice({
  name: 'cmdbOsNormalization',
  initialState,
  reducers: {
    clearCmdbOsNormalization: () => {
      return initialState;
    },
    clearCmdbOsNormalizationMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmdbOsNormalizationGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmdbOsNormalization.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmdbOsNormalization.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchCmdbOsNormalization.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmdbOsNormalizationById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmdbOsNormalizationById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmdbOsNormalization>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmdbOsNormalizationById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmdbOsNormalization.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmdbOsNormalization.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmdbOsNormalization.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteCmdbOsNormalization.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmdbOsNormalization.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmdbOsNormalization.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },
  },
});

// A selector
export const cmdbOsNormalizationSelector = (state: RootState) => state.cmdbOsNormalization;

// Actions
export const {
  clearCmdbOsNormalization,
  clearCmdbOsNormalizationMessages,
  clearCmdbOsNormalizationGetById,
  setTableColumnSelection,
} = cmdbOsNormalizationSlice.actions;

// The reducer
export default cmdbOsNormalizationSlice.reducer;
