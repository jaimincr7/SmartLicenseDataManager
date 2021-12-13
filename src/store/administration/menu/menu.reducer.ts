import { IGetMenuAccessRights } from '../../../services/administration/menu/menu.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import {
  IMenu,
  IMenuRightsByCompanyId,
  IMenuRightsByRoleId,
} from '../../../services/administration/menu/menu.model';
import { RootState } from '../../app.model';
import {
  searchMenu,
  getMenuById,
  saveMenu,
  getMenuRightsByRoleId,
  saveMenuAccessRights,
  getRoleLookup,
  saveCompanyMenuAccessRights,
  getMenuRightsByCompanyId,
  getMenuAccessRights,
  saveAddRemoveMenuAccessRights,
  addParentMenu,
  deleteParentMenu,
} from './menu.action';
import { IMenuState } from './menu.model';
import { ILookup } from '../../../services/common/common.model';

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
  addParentMenu: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  deleteParentMenu: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  getMenuRightsByRoleId: {
    loading: false,
    hasErrors: false,
    data: null,
  },
  saveMenuAccessRights: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  getMenuRightsByCompanyId: {
    loading: false,
    hasErrors: false,
    data: null,
  },
  saveCompanyMenuAccessRights: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  roleLookup: {
    data: [],
    loading: false,
  },
  getMenuAccessRights: {
    loading: false,
    hasErrors: false,
    data: null,
  },
  saveAddRemoveMenuAccessRights: {
    loading: false,
    hasErrors: false,
    messages: [],
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
      state.saveMenuAccessRights.messages = [];
      state.saveCompanyMenuAccessRights.messages = [];
      state.saveAddRemoveMenuAccessRights.messages = [];
    },
    clearMenuGetById: (state) => {
      state.getById.data = null;
    },
    clearMenuAccessRights: (state) => {
      state.saveMenuAccessRights = initialState.saveCompanyMenuAccessRights;
      state.saveCompanyMenuAccessRights = initialState.saveCompanyMenuAccessRights;
    },
    clearGetMenuRightsByRoleId: (state) => {
      state.getMenuRightsByRoleId.data = null;
    },
    clearGetMenuRightsByCompanyId: (state) => {
      state.getMenuRightsByCompanyId.data = null;
    },
    clearAddParentMenuMessages: (state) => {
      state.addParentMenu.messages = [];
    },
    clearDeleteParentMenuMessages: (state) => {
      state.deleteParentMenu.messages = [];
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
    [saveMenu.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Get Menu Rights By RoleId
    [getMenuRightsByRoleId.pending.type]: (state) => {
      state.getMenuRightsByRoleId.loading = true;
    },
    [getMenuRightsByRoleId.fulfilled.type]: (state, action: PayloadAction<IMenuRightsByRoleId>) => {
      action.payload.menus = action.payload.menus?.filter((x) => x.child_menu_rights?.length !== 0);
      state.getMenuRightsByRoleId.data = action.payload;
      state.getMenuRightsByRoleId.loading = false;
      state.getMenuRightsByRoleId.hasErrors = false;
    },
    [getMenuRightsByRoleId.rejected.type]: (state) => {
      state.getMenuRightsByRoleId.loading = false;
      state.getMenuRightsByRoleId.hasErrors = true;
    },

    // Save Menu Access Rights
    [saveMenuAccessRights.pending.type]: (state) => {
      state.saveMenuAccessRights.loading = true;
      state.saveMenuAccessRights.messages = [];
    },
    [saveMenuAccessRights.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveMenuAccessRights.loading = false;
      state.saveMenuAccessRights.hasErrors = false;
      state.saveMenuAccessRights.messages = action.payload.messages;
    },
    [saveMenuAccessRights.rejected.type]: (state) => {
      state.saveMenuAccessRights.loading = false;
      state.saveMenuAccessRights.hasErrors = true;
    },

    // Add Parent Menu
    [addParentMenu.pending.type]: (state) => {
      state.addParentMenu.loading = true;
      state.addParentMenu.messages = [];
    },
    [addParentMenu.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.addParentMenu.loading = false;
      state.addParentMenu.hasErrors = false;
      state.addParentMenu.messages = action.payload.messages;
    },
    [addParentMenu.rejected.type]: (state) => {
      state.addParentMenu.loading = false;
      state.addParentMenu.hasErrors = true;
    },

    // Delete Parent Menu
    [deleteParentMenu.pending.type]: (state) => {
      state.deleteParentMenu.loading = true;
      state.deleteParentMenu.messages = [];
    },
    [deleteParentMenu.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.deleteParentMenu.loading = false;
      state.deleteParentMenu.hasErrors = false;
      state.deleteParentMenu.messages = action.payload.messages;
    },
    [deleteParentMenu.rejected.type]: (state) => {
      state.deleteParentMenu.loading = false;
      state.deleteParentMenu.hasErrors = true;
    },

    // Get Menu Rights By RoleId
    [getMenuRightsByCompanyId.pending.type]: (state) => {
      state.getMenuRightsByCompanyId.loading = true;
    },
    [getMenuRightsByCompanyId.fulfilled.type]: (
      state,
      action: PayloadAction<IMenuRightsByCompanyId>
    ) => {
      action.payload.menus = action.payload.menus?.filter((x) => x.child_menu_rights?.length !== 0);
      state.getMenuRightsByCompanyId.data = action.payload;
      state.getMenuRightsByCompanyId.loading = false;
      state.getMenuRightsByCompanyId.hasErrors = false;
    },
    [getMenuRightsByCompanyId.rejected.type]: (state) => {
      state.getMenuRightsByCompanyId.loading = false;
      state.getMenuRightsByCompanyId.hasErrors = true;
    },

    // Save Company Menu Access Rights
    [saveCompanyMenuAccessRights.pending.type]: (state) => {
      state.saveCompanyMenuAccessRights.loading = true;
      state.saveCompanyMenuAccessRights.messages = [];
    },
    [saveCompanyMenuAccessRights.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveCompanyMenuAccessRights.loading = false;
      state.saveCompanyMenuAccessRights.hasErrors = false;
      state.saveCompanyMenuAccessRights.messages = action.payload.messages;
    },
    [saveCompanyMenuAccessRights.rejected.type]: (state) => {
      state.saveCompanyMenuAccessRights.loading = false;
      state.saveCompanyMenuAccessRights.hasErrors = true;
    },

    // Role lookup
    [getRoleLookup.pending.type]: (state) => {
      state.roleLookup.loading = true;
    },
    [getRoleLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.roleLookup.data = action.payload;
      state.roleLookup.loading = false;
    },

    // Get Menu Rights
    [getMenuAccessRights.pending.type]: (state) => {
      state.getMenuAccessRights.loading = true;
    },
    [getMenuAccessRights.fulfilled.type]: (state, action: PayloadAction<IGetMenuAccessRights>) => {
      state.getMenuAccessRights.data = action.payload;
      state.getMenuAccessRights.loading = false;
      state.getMenuAccessRights.hasErrors = false;
    },
    [getMenuAccessRights.rejected.type]: (state) => {
      state.getMenuAccessRights.loading = false;
      state.getMenuAccessRights.hasErrors = true;
    },

    // Save Menu Access Rights
    [saveAddRemoveMenuAccessRights.pending.type]: (state) => {
      state.saveAddRemoveMenuAccessRights.loading = true;
      state.saveAddRemoveMenuAccessRights.messages = [];
    },
    [saveAddRemoveMenuAccessRights.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.saveAddRemoveMenuAccessRights.loading = false;
      state.saveAddRemoveMenuAccessRights.hasErrors = false;
      state.saveAddRemoveMenuAccessRights.messages = action.payload.messages;
    },
    [saveAddRemoveMenuAccessRights.rejected.type]: (state) => {
      state.saveAddRemoveMenuAccessRights.loading = false;
      state.saveAddRemoveMenuAccessRights.hasErrors = true;
    },
  },
});

// A selector
export const menuSelector = (state: RootState) => state.menu;

// Actions
export const {
  clearMenu,
  clearMenuMessages,
  clearMenuGetById,
  setTableColumnSelection,
  clearMenuAccessRights,
  clearGetMenuRightsByRoleId,
  clearGetMenuRightsByCompanyId,
  clearAddParentMenuMessages,
} = menuSlice.actions;

// The reducer
export default menuSlice.reducer;
