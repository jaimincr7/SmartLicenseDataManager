import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiOauthUrlInjectionSiteState } from './apiOauthUrlInjectionSite.model';
import {
  deleteSpsApiOauthUrlInjectionSite,
  getSpsApiOauthUrlInjectionSiteById,
  saveSpsApiOauthUrlInjectionSite,
  searchSpsApiOauthUrlInjectionSite,
} from './apiOauthUrlInjectionSite.action';
import { ISpsApiOauthUrlInjectionSite } from '../../../services/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.model';

export const initialState: ISpsApiOauthUrlInjectionSiteState = {
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

export const spsApiOauthUrlInjectionSiteSlice = createSlice({
  name: 'spsApiOauthUrlInjectionSite',
  initialState,
  reducers: {
    clearSpsApiOauthUrlInjectionSite: () => {
      return initialState;
    },
    clearSpsApiOauthUrlInjectionSiteMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiOauthUrlInjectionSiteGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiOauthUrlInjectionSite.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiOauthUrlInjectionSite.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiOauthUrlInjectionSite.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiOauthUrlInjectionSiteById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiOauthUrlInjectionSiteById.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiOauthUrlInjectionSite>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiOauthUrlInjectionSiteById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiOauthUrlInjectionSite.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiOauthUrlInjectionSite.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiOauthUrlInjectionSite.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiOauthUrlInjectionSite.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiOauthUrlInjectionSite.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiOauthUrlInjectionSite.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiOauthUrlInjectionSiteSelector = (state: RootState) =>
  state.spsApiOauthUrlInjectionSite;

// Actions
export const {
  clearSpsApiOauthUrlInjectionSite,
  clearSpsApiOauthUrlInjectionSiteMessages,
  clearSpsApiOauthUrlInjectionSiteGetById,
  setTableColumnSelection,
} = spsApiOauthUrlInjectionSiteSlice.actions;

// The reducer
export default spsApiOauthUrlInjectionSiteSlice.reducer;
