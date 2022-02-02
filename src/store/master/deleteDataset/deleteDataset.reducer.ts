import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { IDeleteDataset } from '../../../services/master/deleteDataset/deleteDataset.model';
import { RootState } from '../../app.model';
import {
  deleteDeleteDataset,
  getDeleteDatasetById,
  saveDeleteDataset,
  searchDeleteDataset,
} from './deleteDataset.action';
import { IDeleteDatasetState } from './deleteDataset.model';

export const initialState: IDeleteDatasetState = {
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

export const deleteDatasetSlice = createSlice({
  name: 'deleteDataset',
  initialState,
  reducers: {
    clearDeleteDataset: () => {
      return initialState;
    },
    clearDeleteDatasetMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearDeleteDatasetGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchDeleteDataset.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchDeleteDataset.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchDeleteDataset.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getDeleteDatasetById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getDeleteDatasetById.fulfilled.type]: (state, action: PayloadAction<IDeleteDataset>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getDeleteDatasetById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveDeleteDataset.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveDeleteDataset.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveDeleteDataset.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteDeleteDataset.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteDeleteDataset.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteDeleteDataset.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const deleteDatasetSelector = (state: RootState) => state.deleteDataset;

// Actions
export const {
  clearDeleteDataset,
  clearDeleteDatasetMessages,
  clearDeleteDatasetGetById,
  setTableColumnSelection,
} = deleteDatasetSlice.actions;

// The reducer
export default deleteDatasetSlice.reducer;
