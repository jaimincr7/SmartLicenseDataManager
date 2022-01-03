import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiInjectionParamV2State } from './apiInjectionParamV2.model';
import {
  deleteSpsApiInjectionParamV2,
  getSpsApiInjectionParamV2,
  getSpsApiInjectionParamV2ById,
  saveSpsApiInjectionParamV2,
  searchSpsApiInjectionParamV2,
} from './apiInjectionParamV2.action';
import { ISpsApiInjectionParamV2 } from '../../../services/sps/apiInjectionParamV2/apiInjectionParamV2.model';

export const initialState: ISpsApiInjectionParamV2State = {
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
  getInjectionParam: {
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

export const spsApiInjectionParamV2Slice = createSlice({
  name: 'spsApiInjectionParamV2',
  initialState,
  reducers: {
    clearSpsApiInjectionParamV2: () => {
      return initialState;
    },
    clearSpsApiInjectionParamV2Messages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiInjectionParamV2GetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiInjectionParamV2.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiInjectionParamV2.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchSpsApiInjectionParamV2.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiInjectionParamV2ById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiInjectionParamV2ById.fulfilled.type]: (
      state,
      action: PayloadAction<ISpsApiInjectionParamV2>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiInjectionParamV2ById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Get Injection Param
    [getSpsApiInjectionParamV2.pending.type]: (state) => {
      state.getInjectionParam.loading = true;
    },
    [getSpsApiInjectionParamV2.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.getInjectionParam.data = action.payload;
      state.getInjectionParam.loading = false;
      state.getInjectionParam.hasErrors = false;
    },
    [getSpsApiInjectionParamV2.rejected.type]: (state) => {
      state.getInjectionParam.loading = false;
      state.getInjectionParam.hasErrors = true;
    },

    // Save
    [saveSpsApiInjectionParamV2.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiInjectionParamV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiInjectionParamV2.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiInjectionParamV2.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiInjectionParamV2.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiInjectionParamV2.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiInjectionParamV2Selector = (state: RootState) => state.spsApiInjectionParamV2;

// Actions
export const {
  clearSpsApiInjectionParamV2,
  clearSpsApiInjectionParamV2Messages,
  clearSpsApiInjectionParamV2GetById,
  setTableColumnSelection,
} = spsApiInjectionParamV2Slice.actions;

// The reducer
export default spsApiInjectionParamV2Slice.reducer;
