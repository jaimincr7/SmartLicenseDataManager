import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { IConfigFileCategoriesState } from './fileCategories.model';
import {
  deleteConfigFileCategories,
  getConfigFileCategoriesById,
  saveConfigFileCategories,
  searchConfigFileCategories,
} from './fileCategories.action';
import { IConfigFileCategories } from '../../../services/master/fileCategories/fileCategories.model';

export const initialState: IConfigFileCategoriesState = {
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

export const configFileCategoriesSlice = createSlice({
  name: 'configFileCategories',
  initialState,
  reducers: {
    clearConfigFileCategories: () => {
      return initialState;
    },
    clearConfigFileCategoriesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigFileCategoriesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigFileCategories.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigFileCategories.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigFileCategories.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigFileCategoriesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigFileCategoriesById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigFileCategories>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigFileCategoriesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigFileCategories.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigFileCategories.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigFileCategories.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigFileCategories.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigFileCategories.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigFileCategories.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configFileCategoriesSelector = (state: RootState) => state.configFileCategories;

// Actions
export const {
  clearConfigFileCategories,
  clearConfigFileCategoriesMessages,
  clearConfigFileCategoriesGetById,
  setTableColumnSelection,
} = configFileCategoriesSlice.actions;

// The reducer
export default configFileCategoriesSlice.reducer;
