import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiOauthIdUrlInjectionSiteState } from './apiOauthIdUrlInjectionSite.model';
import {
  deleteSpsApiOauthIdUrlInjectionSite,
  getSpsApiOauthIdUrlInjectionSiteById,
  saveSpsApiOauthIdUrlInjectionSite,
  searchSpsApiOauthIdUrlInjectionSite,
} from './apiOauthIdUrlInjectionSite.action';
import { ISpsApiOauthIdUrlInjectionSite } from '../../../services/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.model';

export const initialState: ISpsApiOauthIdUrlInjectionSiteState = {
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

export const spsApiOauthIdUrlInjectionSiteSlice = createSlice({
  name: 'spsApiOauthIdUrlInjectionSite',
  initialState,
  reducers: {
    clearSpsApiOauthIdUrlInjectionSite: () => {
      return initialState;
    },
    clearSpsApiOauthIdUrlInjectionSiteMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiOauthIdUrlInjectionSiteGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiOauthIdUrlInjectionSite.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiOauthIdUrlInjectionSite.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiOauthIdUrlInjectionSite.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiOauthIdUrlInjectionSiteById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiOauthIdUrlInjectionSiteById.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiOauthIdUrlInjectionSite>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiOauthIdUrlInjectionSiteById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiOauthIdUrlInjectionSite.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiOauthIdUrlInjectionSite.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiOauthIdUrlInjectionSite.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiOauthIdUrlInjectionSite.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiOauthIdUrlInjectionSite.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiOauthIdUrlInjectionSite.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiOauthIdUrlInjectionSiteSelector = (state: RootState) =>
  state.spsApiOauthIdUrlInjectionSite;

// Actions
export const {
  clearSpsApiOauthIdUrlInjectionSite,
  clearSpsApiOauthIdUrlInjectionSiteMessages,
  clearSpsApiOauthIdUrlInjectionSiteGetById,
  setTableColumnSelection,
} = spsApiOauthIdUrlInjectionSiteSlice.actions;

// The reducer
export default spsApiOauthIdUrlInjectionSiteSlice.reducer;
