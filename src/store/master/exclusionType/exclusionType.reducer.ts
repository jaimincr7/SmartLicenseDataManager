import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigExclusionTypeState } from './exclusionType.model';
import {
  deleteConfigExclusionType,
  getConfigExclusionTypeById,
  saveConfigExclusionType,
  searchConfigExclusionType,
} from './exclusionType.action';
import { IConfigExclusionType } from '../../../services/master/exclusionType/exclusionType.model';

export const initialState: IConfigExclusionTypeState = {
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

export const configExclusionTypeSlice = createSlice({
  name: 'configExclusionType',
  initialState,
  reducers: {
    clearConfigExclusionType: () => {
      return initialState;
    },
    clearConfigExclusionTypeMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigExclusionTypeGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigExclusionType.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigExclusionType.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigExclusionType.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigExclusionTypeById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigExclusionTypeById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigExclusionType>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigExclusionTypeById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigExclusionType.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigExclusionType.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigExclusionType.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigExclusionType.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigExclusionType.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigExclusionType.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configExclusionTypeSelector = (state: RootState) => state.configExclusionType;

// Actions
export const {
  clearConfigExclusionType,
  clearConfigExclusionTypeMessages,
  clearConfigExclusionTypeGetById,
  setTableColumnSelection,
} = configExclusionTypeSlice.actions;

// The reducer
export default configExclusionTypeSlice.reducer;
