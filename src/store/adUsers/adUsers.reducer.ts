import { booleanLookup } from './../../common/constants/common';
import { IAdUsersState } from './adUsers.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../common/models/common';
import { RootState } from '../app.model';
import { searchAdUsers, getAdUserById, saveAdUser, deleteAdUser } from './adUsers.action';
import { IAdUser } from '../../services/adUsers/adUsers.model';

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
    },
    clearAdUsersGetById: (state) => {
      state.getById.data = null;
    },
  },
  extraReducers: {
    // Search
    [searchAdUsers.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAdUsers.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<IAdUser>>) => {
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
  },
});

// A selector
export const adUsersSelector = (state: RootState) => state.adUsers;

// Actions
export const { clearAdUsers, clearAdUsersGetById, clearAdUsersMessages } = adUsersSlice.actions;

// The reducer
export default adUsersSlice.reducer;
