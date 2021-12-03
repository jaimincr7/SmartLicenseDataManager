import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAdDevices } from '../../../services/ad/adDevices/adDevices.model';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import {
  deleteAdDevice,
  getAdDeviceById,
  searchAdDevices,
  saveAdDevice,
  processDataAdDevice,
} from './adDevices.action';
import { IAdDevicesState } from './adDevices.model';

export const initialState: IAdDevicesState = {
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
  processData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const adDevicesSlice = createSlice({
  name: 'adDevices',
  initialState,
  reducers: {
    clearAdDevices: () => {
      return initialState;
    },
    clearAdDeviceMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearAdDeviceGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAdDevices.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAdDevices.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IAdDevices>>
    ) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest, booleanLookup };
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
    [searchAdDevices.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAdDeviceById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAdDeviceById.fulfilled.type]: (state, action: PayloadAction<IAdDevices>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAdDeviceById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAdDevice.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAdDevice.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAdDevice.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAdDevice.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAdDevice.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAdDevice.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataAdDevice.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataAdDevice.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataAdDevice.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const adDevicesSelector = (state: RootState) => state.adDevices;

// Actions
export const {
  clearAdDevices,
  clearAdDeviceMessages,
  clearAdDeviceGetById,
  setTableColumnSelection,
} = adDevicesSlice.actions;

// The reducer
export default adDevicesSlice.reducer;
