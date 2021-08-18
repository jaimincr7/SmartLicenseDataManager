import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsCategoryExtendedState } from './categoryExtended.model';
import {
  deleteCmsCategoryExtended,
  getCmsCategoryExtendedById,
  saveCmsCategoryExtended,
  searchCmsCategoryExtended,
} from './categoryExtended.action';
import { ICmsCategoryExtended } from '../../../services/cms/categoryExtended/categoryExtended.model';

export const initialState: ICmsCategoryExtendedState = {
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

export const cmsCategoryExtendedSlice = createSlice({
  name: 'cmsCategoryExtended',
  initialState,
  reducers: {
    clearCmsCategoryExtended: () => {
      return initialState;
    },
    clearCmsCategoryExtendedMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsCategoryExtendedGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsCategoryExtended.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsCategoryExtended.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
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
    [searchCmsCategoryExtended.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsCategoryExtendedById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsCategoryExtendedById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmsCategoryExtended>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsCategoryExtendedById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsCategoryExtended.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsCategoryExtended.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsCategoryExtended.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsCategoryExtended.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsCategoryExtended.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsCategoryExtended.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsCategoryExtendedSelector = (state: RootState) => state.cmsCategoryExtended;

// Actions
export const {
  clearCmsCategoryExtended,
  clearCmsCategoryExtendedMessages,
  clearCmsCategoryExtendedGetById,
  setTableColumnSelection,
} = cmsCategoryExtendedSlice.actions;

// The reducer
export default cmsCategoryExtendedSlice.reducer;
