import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsCategoryState } from './cmsCategory.model';
import { ICmsCategory } from '../../../services/cms/cmsCategory/cmsCategory.model';
import {
  deleteCmsCategory,
  getCmsCategoryById,
  saveCmsCategory,
  searchCmsCategory,
} from './cmsCategory.action';

export const initialState: ICmsCategoryState = {
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

export const cmsCategorySlice = createSlice({
  name: 'cmsCategory',
  initialState,
  reducers: {
    clearCmsCategory: () => {
      return initialState;
    },
    clearCmsCategoryMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsCategoryGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsCategory.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsCategory.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
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
    [searchCmsCategory.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsCategoryById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsCategoryById.fulfilled.type]: (state, action: PayloadAction<ICmsCategory>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsCategoryById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsCategory.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsCategory.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsCategory.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsCategory.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsCategory.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsCategory.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsCategorySelector = (state: RootState) => state.cmsCategory;

// Actions
export const {
  clearCmsCategory,
  clearCmsCategoryMessages,
  clearCmsCategoryGetById,
  setTableColumnSelection,
} = cmsCategorySlice.actions;

// The reducer
export default cmsCategorySlice.reducer;
