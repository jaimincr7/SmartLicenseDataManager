import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISlim360O365UserLicenses } from '../../../services/slim360/o365UserLicenses/o365UserLicenses.model';
import { RootState } from '../../app.model';
import {
  deleteSlim360O365UserLicenses,
  getSlim360O365UserLicensesById,
  saveSlim360O365UserLicenses,
  searchSlim360O365UserLicenses,
} from './o365UserLicenses.action';
import { ISlim360O365UserLicensesState } from './o365UserLicenses.model';

export const initialState: ISlim360O365UserLicensesState = {
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

export const slim360O365UserLicensesSlice = createSlice({
  name: 'slim360O365UserLicenses',
  initialState,
  reducers: {
    clearSlim360O365UserLicenses: () => {
      return initialState;
    },
    clearSlim360O365UserLicensesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSlim360O365UserLicensesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSlim360O365UserLicenses.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSlim360O365UserLicenses.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISlim360O365UserLicenses>>
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
    [searchSlim360O365UserLicenses.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSlim360O365UserLicensesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSlim360O365UserLicensesById.fulfilled.type]: (
      state,
      action: PayloadAction<ISlim360O365UserLicenses>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSlim360O365UserLicensesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSlim360O365UserLicenses.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSlim360O365UserLicenses.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSlim360O365UserLicenses.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSlim360O365UserLicenses.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSlim360O365UserLicenses.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSlim360O365UserLicenses.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const slim360O365UserLicensesSelector = (state: RootState) => state.slim360O365UserLicenses;

// Actions
export const {
  clearSlim360O365UserLicenses,
  clearSlim360O365UserLicensesMessages,
  clearSlim360O365UserLicensesGetById,
  setTableColumnSelection,
} = slim360O365UserLicensesSlice.actions;

// The reducer
export default slim360O365UserLicensesSlice.reducer;
