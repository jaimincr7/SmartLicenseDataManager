import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { ITenant } from '../../../services/master/tenant/tenant.model';
import { RootState } from '../../app.model';
import { deleteTenant, getTenantById, saveTenant, searchTenant } from './tenant.action';
import { ITenantState } from './tenant.model';
import { ISearchResponse } from './../../../common/models/common';

export const initialState: ITenantState = {
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

export const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearTenant: () => {
      return initialState;
    },
    clearTenantMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearTenantGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchTenant.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchTenant.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<ITenant>>) => {
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
    [searchTenant.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getTenantById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getTenantById.fulfilled.type]: (state, action: PayloadAction<ITenant>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getTenantById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveTenant.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveTenant.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveTenant.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteTenant.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteTenant.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteTenant.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const tenantSelector = (state: RootState) => state.tenant;

// Actions
export const { clearTenant, clearTenantMessages, clearTenantGetById, setTableColumnSelection } =
  tenantSlice.actions;

// The reducer
export default tenantSlice.reducer;
