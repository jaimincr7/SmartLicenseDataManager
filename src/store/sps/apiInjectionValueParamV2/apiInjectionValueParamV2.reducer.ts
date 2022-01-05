import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiInjectionValueParamV2State } from './apiInjectionValueParamV2.model';
import {
  deleteSpsApiInjectionValueParamV2,
  getSpsApiInjectionValueParamV2ById,
  getSpsApiInjectionValueV2ByOauthId,
  saveSpsApiInjectionValueParamV2,
  searchSpsApiInjectionValueParamV2,
} from './apiInjectionValueParamV2.action';
import { ISpsApiInjectionValueParamV2 } from '../../../services/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.model';

export const initialState: ISpsApiInjectionValueParamV2State = {
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
  getByOauthId: {
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

export const spsApiInjectionValueParamV2Slice = createSlice({
  name: 'spsApiInjectionValueParamV2',
  initialState,
  reducers: {
    clearSpsApiInjectionValueParamV2: () => {
      return initialState;
    },
    clearSpsApiInjectionValueParamV2Messages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiInjectionValueParamV2GetById: (state) => {
      state.getById.data = null;
      state.getByOauthId.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiInjectionValueParamV2.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiInjectionValueParamV2.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiInjectionValueParamV2.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiInjectionValueParamV2ById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiInjectionValueParamV2ById.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiInjectionValueParamV2>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiInjectionValueParamV2ById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Get by Oauth id
    [getSpsApiInjectionValueV2ByOauthId.pending.type]: (state) => {
      state.getByOauthId.loading = true;
    },
    [getSpsApiInjectionValueV2ByOauthId.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiInjectionValueParamV2[]>
    ) => {
      state.getByOauthId.data = action.payload;
      state.getByOauthId.loading = false;
      state.getByOauthId.hasErrors = false;
    },
    [getSpsApiInjectionValueV2ByOauthId.rejected.type]: (state) => {
      state.getByOauthId.loading = false;
      state.getByOauthId.hasErrors = true;
    },

    // Save
    [saveSpsApiInjectionValueParamV2.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiInjectionValueParamV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiInjectionValueParamV2.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiInjectionValueParamV2.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiInjectionValueParamV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiInjectionValueParamV2.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiInjectionValueParamV2Selector = (state: RootState) =>
  state.spsApiInjectionValueParamV2;

// Actions
export const {
  clearSpsApiInjectionValueParamV2,
  clearSpsApiInjectionValueParamV2Messages,
  clearSpsApiInjectionValueParamV2GetById,
  setTableColumnSelection,
} = spsApiInjectionValueParamV2Slice.actions;

// The reducer
export default spsApiInjectionValueParamV2Slice.reducer;
