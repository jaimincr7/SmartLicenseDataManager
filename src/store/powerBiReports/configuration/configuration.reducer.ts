import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import {
  deleteConfiguration,
  getConfigurationById,
  saveConfiguration,
  searchConfiguration,
  getGroups,
  getReportsByGroupId,
} from './configuration.action';
import { IConfigurationState } from './configuration.model';
import {
  IConfiguration,
  IPowerBIReport,
  IWorkspace,
} from '../../../services/powerBiReports/configuration/configuration.model';

export const initialState: IConfigurationState = {
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
  getGroups: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  getReportsByGroupId: {
    loading: false,
    hasErrors: false,
    data: [],
  },
};

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    clearConfiguration: () => {
      return initialState;
    },
    clearConfigurationMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigurationGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfiguration.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfiguration.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, table_name, total_count, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      if (column_selection) {
        state.tableColumnSelection.id = column_selection.id;
        state.tableColumnSelection.columns = JSON.parse(column_selection.columns as any);
      }
      state.tableColumnSelection.table_name = table_name;
    },
    [searchConfiguration.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigurationById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigurationById.fulfilled.type]: (state, action: PayloadAction<IConfiguration>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigurationById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfiguration.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfiguration.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfiguration.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfiguration.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfiguration.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfiguration.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Get groups
    [getGroups.pending.type]: (state) => {
      state.getGroups.loading = true;
    },
    [getGroups.fulfilled.type]: (state, action: PayloadAction<IWorkspace[]>) => {
      state.getGroups.data = action.payload;
      state.getGroups.loading = false;
      state.getGroups.hasErrors = false;
    },
    [getGroups.rejected.type]: (state) => {
      state.getGroups.loading = false;
      state.getGroups.hasErrors = true;
    },

    // Get reports by group id
    [getReportsByGroupId.pending.type]: (state) => {
      state.getReportsByGroupId.loading = true;
    },
    [getReportsByGroupId.fulfilled.type]: (state, action: PayloadAction<IPowerBIReport[]>) => {
      state.getReportsByGroupId.data = action.payload;
      state.getReportsByGroupId.loading = false;
      state.getReportsByGroupId.hasErrors = false;
    },
    [getReportsByGroupId.rejected.type]: (state) => {
      state.getReportsByGroupId.loading = false;
      state.getReportsByGroupId.hasErrors = true;
    },
  },
});

// A selector
export const configurationSelector = (state: RootState) => state.configuration;

// Actions
export const {
  clearConfiguration,
  clearConfigurationMessages,
  clearConfigurationGetById,
  setTableColumnSelection,
} = configurationSlice.actions;

// The reducer
export default configurationSlice.reducer;
