import { booleanLookup } from './../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import { IAdDevicesExclusions } from '../../services/adDevicesExclusions/adDevicesExclusions.model';
import { RootState } from '../app.model';
import {
  deleteAdDevicesExclusions,
  getAdDevicesExclusionsById,
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
    tableName: '',
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
    },
    clearAdDevicesExclusionsGetById: (state) => {
      state.getById.data = null;
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
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest, booleanLookup };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
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
  },
});

// A selector
export const adDevicesExclusionsSelector = (state: RootState) => state.adDevicesExclusions;

// Actions
export const {
  clearAdDevicesExclusions,
  clearAdDevicesExclusionsMessages,
  clearAdDevicesExclusionsGetById,
} = adDevicesExclusionsSlice.actions;

// The reducer
export default adDevicesExclusionsSlice.reducer;
