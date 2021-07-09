import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IWindowsServerLicense } from '../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';
import { RootState } from '../../app.model';
import {
  deleteWindowsServerLicense,
  getWindowsServerLicenseById,
  reRunAllScenarios,
  saveWindowsServerLicense,
  searchWindowsServerLicense,
} from './windowsServerLicense.action';
import { IWindowsServerLicenseState } from './windowsServerLicense.model';

export const initialState: IWindowsServerLicenseState = {
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
  reRunAllScenarios: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const windowsServerLicenseSlice = createSlice({
  name: 'windowsServerLicense',
  initialState,
  reducers: {
    clearWindowsServerLicense: () => {
      return initialState;
    },
    clearWindowsServerLicenseMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearWindowsServerLicenseGetById: (state) => {
      state.getById.data = null;
    },
    clearWindowsServerLicenseReRunAllScenariosMessages: (state) => {
      state.reRunAllScenarios.messages = [];
    },
  },
  extraReducers: {
    // Search
    [searchWindowsServerLicense.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IWindowsServerLicense>>
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
    [searchWindowsServerLicense.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getWindowsServerLicenseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getWindowsServerLicenseById.fulfilled.type]: (
      state,
      action: PayloadAction<IWindowsServerLicense>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getWindowsServerLicenseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveWindowsServerLicense.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveWindowsServerLicense.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteWindowsServerLicense.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteWindowsServerLicense.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },

    // Re-run all scenario
    [reRunAllScenarios.pending.type]: (state) => {
      state.reRunAllScenarios.loading = true;
      state.reRunAllScenarios.messages = [];
    },
    [reRunAllScenarios.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.reRunAllScenarios.loading = false;
      state.reRunAllScenarios.hasErrors = false;
      state.reRunAllScenarios.messages = action.payload.messages;
    },
    [reRunAllScenarios.rejected.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.reRunAllScenarios.loading = false;
      state.reRunAllScenarios.hasErrors = true;
      state.reRunAllScenarios.messages = action.payload.errors;
    },
  },
});

// A selector
export const windowsServerLicenseSelector = (state: RootState) => state.windowsServerLicense;

// Actions
export const {
  clearWindowsServerLicense,
  clearWindowsServerLicenseMessages,
  clearWindowsServerLicenseGetById,
  clearWindowsServerLicenseReRunAllScenariosMessages,
} = windowsServerLicenseSlice.actions;

// The reducer
export default windowsServerLicenseSlice.reducer;
