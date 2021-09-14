import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigSupportTypesState } from './supportTypes.model';
import {
  deleteConfigSupportTypes,
  getConfigSupportTypesById,
  saveConfigSupportTypes,
  searchConfigSupportTypes,
} from './supportTypes.action';
import { IConfigSupportTypes } from '../../../services/master/supportTypes/supportTypes.model';

export const initialState: IConfigSupportTypesState = {
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

export const configSupportTypesSlice = createSlice({
  name: 'configSupportTypes',
  initialState,
  reducers: {
    clearConfigSupportTypes: () => {
      return initialState;
    },
    clearConfigSupportTypesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigSupportTypesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigSupportTypes.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigSupportTypes.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigSupportTypes.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigSupportTypesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigSupportTypesById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigSupportTypes>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigSupportTypesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigSupportTypes.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigSupportTypes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigSupportTypes.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigSupportTypes.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigSupportTypes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigSupportTypes.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configSupportTypesSelector = (state: RootState) => state.configSupportTypes;

// Actions
export const {
  clearConfigSupportTypes,
  clearConfigSupportTypesMessages,
  clearConfigSupportTypesGetById,
  setTableColumnSelection,
} = configSupportTypesSlice.actions;

// The reducer
export default configSupportTypesSlice.reducer;
