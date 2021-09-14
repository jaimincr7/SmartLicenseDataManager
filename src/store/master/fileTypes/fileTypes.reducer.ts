import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigFileTypeState } from './fileTypes.model';
import {
  deleteConfigFileType,
  getConfigFileTypeById,
  saveConfigFileType,
  searchConfigFileType,
} from './fileTypes.action';
import { IConfigFileType } from '../../../services/master/fileTypes/fileTypes.model';

export const initialState: IConfigFileTypeState = {
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

export const configFileTypeSlice = createSlice({
  name: 'configFileType',
  initialState,
  reducers: {
    clearConfigFileType: () => {
      return initialState;
    },
    clearConfigFileTypeMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigFileTypeGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigFileType.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigFileType.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigFileType.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigFileTypeById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigFileTypeById.fulfilled.type]: (state, action: PayloadAction<IConfigFileType>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigFileTypeById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigFileType.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigFileType.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigFileType.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigFileType.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigFileType.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigFileType.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configFileTypeSelector = (state: RootState) => state.configFileType;

// Actions
export const {
  clearConfigFileType,
  clearConfigFileTypeMessages,
  clearConfigFileTypeGetById,
  setTableColumnSelection,
} = configFileTypeSlice.actions;

// The reducer
export default configFileTypeSlice.reducer;
