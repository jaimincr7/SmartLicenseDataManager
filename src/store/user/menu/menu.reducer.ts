import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IMenu, IMenuRightsByRoleId } from '../../../services/user/menu/menu.model';
import { RootState } from '../../app.model';
import { searchMenu, getMenuById, saveMenu, getMenuRightsByRoleId } from './menu.action';
import { IMenuState } from './menu.model';

export const initialState: IMenuState = {
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
  getMenuRightsByRoleId: {
    loading: false,
    hasErrors: false,
    data: null,
  },
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearMenu: () => {
      return initialState;
    },
    clearMenuMessages: (state) => {
      state.save.messages = [];
    },
    clearMenuGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchMenu.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchMenu.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<IMenu>>) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
      if (search_result.column_selection) {
        state.tableColumnSelection.id = search_result.column_selection.id;
        state.tableColumnSelection.columns = JSON.parse(
          search_result.column_selection.columns as any
        );
      }
      state.tableColumnSelection.table_name = search_result.table_name;
    },
    [searchMenu.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getMenuById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getMenuById.fulfilled.type]: (state, action: PayloadAction<IMenu>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getMenuById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveMenu.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveMenu.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveMenu.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
    },

    // Get Menu Rights By RoleId
    [getMenuRightsByRoleId.pending.type]: (state) => {
      state.getMenuRightsByRoleId.loading = true;
    },
    [getMenuRightsByRoleId.fulfilled.type]: (state, action: PayloadAction<IMenuRightsByRoleId>) => {
      state.getMenuRightsByRoleId.data = action.payload;
      state.getMenuRightsByRoleId.loading = false;
      state.getMenuRightsByRoleId.hasErrors = false;
    },
    [getMenuRightsByRoleId.rejected.type]: (state) => {
      state.getMenuRightsByRoleId.loading = false;
      state.getMenuRightsByRoleId.hasErrors = true;
    },
  },
});

// A selector
export const menuSelector = (state: RootState) => state.menu;

// Actions
export const { clearMenu, clearMenuMessages, clearMenuGetById, setTableColumnSelection } =
  menuSlice.actions;

// The reducer
export default menuSlice.reducer;
