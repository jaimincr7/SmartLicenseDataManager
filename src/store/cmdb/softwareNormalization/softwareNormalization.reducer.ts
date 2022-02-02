import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ICmdbSoftwareNormalizationState } from './softwareNormalization.model';
import {
  deleteCmdbSoftwareNormalization,
  getCmdbSoftwareNormalizationById,
  saveCmdbSoftwareNormalization,
  searchCmdbSoftwareNormalization,
} from './softwareNormalization.action';
import { ICmdbSoftwareNormalization } from '../../../services/cmdb/softwareNormalization/softwareNormalization.model';

export const initialState: ICmdbSoftwareNormalizationState = {
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

export const cmdbSoftwareNormalizationSlice = createSlice({
  name: 'cmdbSoftwareNormalization',
  initialState,
  reducers: {
    clearCmdbSoftwareNormalization: () => {
      return initialState;
    },
    clearCmdbSoftwareNormalizationMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmdbSoftwareNormalizationGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmdbSoftwareNormalization.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmdbSoftwareNormalization.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchCmdbSoftwareNormalization.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmdbSoftwareNormalizationById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmdbSoftwareNormalizationById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmdbSoftwareNormalization>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmdbSoftwareNormalizationById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmdbSoftwareNormalization.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmdbSoftwareNormalization.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmdbSoftwareNormalization.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteCmdbSoftwareNormalization.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmdbSoftwareNormalization.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmdbSoftwareNormalization.rejected.type]: (
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
export const cmdbSoftwareNormalizationSelector = (state: RootState) =>
  state.cmdbSoftwareNormalization;

// Actions
export const {
  clearCmdbSoftwareNormalization,
  clearCmdbSoftwareNormalizationMessages,
  clearCmdbSoftwareNormalizationGetById,
  setTableColumnSelection,
} = cmdbSoftwareNormalizationSlice.actions;

// The reducer
export default cmdbSoftwareNormalizationSlice.reducer;
