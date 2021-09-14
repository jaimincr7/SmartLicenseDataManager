import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigLicenseUnitsState } from './licenseUnits.model';
import {
  deleteConfigLicenseUnits,
  getConfigLicenseUnitsById,
  saveConfigLicenseUnits,
  searchConfigLicenseUnits,
} from './licenseUnits.action';
import { IConfigLicenseUnits } from '../../../services/master/licenseUnits/licenseUnits.model';

export const initialState: IConfigLicenseUnitsState = {
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

export const configLicenseUnitsSlice = createSlice({
  name: 'configLicenseUnits',
  initialState,
  reducers: {
    clearConfigLicenseUnits: () => {
      return initialState;
    },
    clearConfigLicenseUnitsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigLicenseUnitsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigLicenseUnits.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigLicenseUnits.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigLicenseUnits.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigLicenseUnitsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigLicenseUnitsById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigLicenseUnits>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigLicenseUnitsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigLicenseUnits.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigLicenseUnits.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigLicenseUnits.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigLicenseUnits.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigLicenseUnits.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigLicenseUnits.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configLicenseUnitsSelector = (state: RootState) => state.configLicenseUnits;

// Actions
export const {
  clearConfigLicenseUnits,
  clearConfigLicenseUnitsMessages,
  clearConfigLicenseUnitsGetById,
  setTableColumnSelection,
} = configLicenseUnitsSlice.actions;

// The reducer
export default configLicenseUnitsSlice.reducer;
