import { IAdUsersState } from './adUsers.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import { RootState } from '../app.model';
import {
  searchAdUsers,
  getAdUserById,
  saveAdUser,
  deleteAdUser,
  getExcelColumns,
  bulkInsert,
} from './adUsers.action';
import { IAdUser, IGetExcelColumns } from '../../services/adUsers/adUsers.model';

export const initialState: IAdUsersState = {
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

export const adUsersSlice = createSlice({
  name: 'adUsers',
  initialState,
  reducers: {
    clearAdUsers: () => {
      return initialState;
    },
    clearAdUsersMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.bulkInsert.messages = [];
    },
    clearAdUsersGetById: (state) => {
      state.getById.data = null;
    },
    clearExcelColumns: (state) => {
      state.getExcelColumns.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchAdUsers.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAdUsers.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<IAdUser>>) => {
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
      state.search.tableName = search_result.table_name;
    },
    [searchAdUsers.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAdUserById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAdUserById.fulfilled.type]: (state, action: PayloadAction<IAdUser>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAdUserById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAdUser.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAdUser.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAdUser.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteAdUser.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAdUser.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAdUser.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
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
export const adUsersSelector = (state: RootState) => state.adUsers;

// Actions
export const { clearAdUsers, clearAdUsersGetById, clearAdUsersMessages, clearExcelColumns } =
  adUsersSlice.actions;

// The reducer
export default adUsersSlice.reducer;
