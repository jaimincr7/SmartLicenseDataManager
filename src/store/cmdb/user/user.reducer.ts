import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmdbUserState } from './user.model';
import { booleanLookup } from '../../../common/constants/common';
import { deleteCmdbUser, getCmdbUserById, saveCmdbUser, searchCmdbUser } from './user.action';
import { ICmdbUser } from '../../../services/cmdb/user/user.model';

export const initialState: ICmdbUserState = {
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

export const cmdbUserSlice = createSlice({
  name: 'cmdbUser',
  initialState,
  reducers: {
    clearCmdbUser: () => {
      return initialState;
    },
    clearCmdbUserMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmdbUserGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmdbUser.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmdbUser.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchCmdbUser.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmdbUserById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmdbUserById.fulfilled.type]: (state, action: PayloadAction<ICmdbUser>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmdbUserById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmdbUser.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmdbUser.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmdbUser.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Delete
    [deleteCmdbUser.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmdbUser.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmdbUser.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
    },
  },
});

// A selector
export const cmdbUserSelector = (state: RootState) => state.cmdbUser;

// Actions
export const {
  clearCmdbUser,
  clearCmdbUserMessages,
  clearCmdbUserGetById,
  setTableColumnSelection,
} = cmdbUserSlice.actions;

// The reducer
export default cmdbUserSlice.reducer;
