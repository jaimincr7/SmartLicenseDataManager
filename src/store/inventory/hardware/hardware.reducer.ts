import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IHardware } from '../../../services/inventory/hardware/hardware.model';
import { RootState } from '../../app.model';
import {
  deleteHardware,
  getHardwareById,
  processDataHardware,
  saveHardware,
  searchHardware,
} from './hardware.action';
import { IHardwareState } from './hardware.model';

export const initialState: IHardwareState = {
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

export const hardwareSlice = createSlice({
  name: 'hardware',
  initialState,
  reducers: {
    clearHardware: () => {
      return initialState;
    },
    clearHardwareMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearHardwareGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchHardware.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchHardware.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<IHardware>>) => {
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
    [searchHardware.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getHardwareById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getHardwareById.fulfilled.type]: (state, action: PayloadAction<IHardware>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getHardwareById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveHardware.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveHardware.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveHardware.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteHardware.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteHardware.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteHardware.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataHardware.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataHardware.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataHardware.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const hardwareSelector = (state: RootState) => state.hardware;

// Actions
export const {
  clearHardware,
  clearHardwareMessages,
  clearHardwareGetById,
  setTableColumnSelection,
} = hardwareSlice.actions;

// The reducer
export default hardwareSlice.reducer;
