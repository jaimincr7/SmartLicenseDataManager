import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { ITenant } from '../../../services/master/tenant/tenant.model';
import { RootState } from '../../app.model';
import { deleteTenant, getTenantById, saveTenant, searchTenant } from './tenant.action';
import { ITenantState } from './tenant.model';

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
    [searchTenant.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      // if (search_result.column_selection) {
      //   state.tableColumnSelection.id = search_result.column_selection.id;
      //   state.tableColumnSelection.columns = JSON.parse(
      //     search_result.column_selection.columns as any
      //   );
      // }
      state.tableColumnSelection.table_name = table_name;
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
    [saveTenant.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = true;
      state.save.messages = action.payload.errors;
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
    [deleteTenant.rejected.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
      state.delete.messages = action.payload.errors;
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
