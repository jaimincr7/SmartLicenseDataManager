import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import {
  IGetExcelColumns,
  IAdDevicesExclusions,
} from '../../services/adDevicesExclusions/adDevicesExclusions.model';
import { RootState } from '../app.model';
import {
  bulkInsert,
  deleteDataset,
  deleteAdDevicesExclusions,
  getExcelColumns,
  getAdDevicesExclusionsById,
  processData,
  saveAdDevicesExclusions,
  searchAdDevicesExclusions,
} from './adDevicesExclusions.action';
import { IAdDevicesExclusionsState } from './adDevicesExclusions.model';

export const initialState: IAdDevicesExclusionsState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
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
  deleteDataset: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  processData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  getExcelColumns: {
    loading: false,
    hasErrors: false,
    data: null,
  },
  bulkInsert: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const adDevicesExclusionsSlice = createSlice({
  name: 'adDevicesExclusions',
  initialState,
  reducers: {
    clearAdDevicesExclusions: () => {
      return initialState;
    },
    clearAdDevicesExclusionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.deleteDataset.messages = [];
      state.processData.messages = [];
      state.bulkInsert.messages = [];
    },
    clearAdDevicesExclusionsGetById: (state) => {
      state.getById.data = null;
    },
    clearExcelColumns: (state) => {
      state.getExcelColumns.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchAdDevicesExclusions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAdDevicesExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IAdDevicesExclusions>>
    ) => {
      const { search_result, ...rest } = action.payload;
      const booleanLookup = [
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' },
      ];

      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest, booleanLookup };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
    },
    [searchAdDevicesExclusions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAdDevicesExclusionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAdDevicesExclusionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IAdDevicesExclusions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAdDevicesExclusionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAdDevicesExclusions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAdDevicesExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAdDevicesExclusions.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteAdDevicesExclusions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAdDevicesExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAdDevicesExclusions.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },

    // Delete Dataset
    [deleteDataset.pending.type]: (state) => {
      state.deleteDataset.loading = true;
      state.deleteDataset.messages = [];
    },
    [deleteDataset.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.deleteDataset.loading = false;
      state.deleteDataset.hasErrors = false;
      state.deleteDataset.messages = action.payload.messages;
    },
    [deleteDataset.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.deleteDataset.loading = false;
      state.deleteDataset.hasErrors = true;
      state.deleteDataset.messages = action.payload.errors;
    },

    // Process Data
    [processData.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processData.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processData.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
      state.processData.messages = action.payload.errors;
    },

    // Get Excel Columns
    [getExcelColumns.pending.type]: (state) => {
      state.getExcelColumns.loading = true;
    },
    [getExcelColumns.fulfilled.type]: (state, action: PayloadAction<IGetExcelColumns>) => {
      state.getExcelColumns.data = action.payload;
      state.getExcelColumns.loading = false;
      state.getExcelColumns.hasErrors = false;
    },
    [getExcelColumns.rejected.type]: (state) => {
      state.getExcelColumns.loading = false;
      state.getExcelColumns.hasErrors = true;
    },

    // Bulk Insert
    [bulkInsert.pending.type]: (state) => {
      state.bulkInsert.loading = true;
      state.bulkInsert.messages = [];
    },
    [bulkInsert.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.bulkInsert.loading = false;
      state.bulkInsert.hasErrors = false;
      state.bulkInsert.messages = action.payload.messages;
    },
    [bulkInsert.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.bulkInsert.loading = false;
      state.bulkInsert.hasErrors = true;
      state.bulkInsert.messages = action.payload.errors;
    },
  },
});

// A selector
export const adDevicesExclusionsSelector = (state: RootState) => state.adDevicesExclusions;

// Actions
export const {
  clearAdDevicesExclusions,
  clearAdDevicesExclusionsMessages,
  clearAdDevicesExclusionsGetById,
  clearExcelColumns,
} = adDevicesExclusionsSlice.actions;

// The reducer
export default adDevicesExclusionsSlice.reducer;
