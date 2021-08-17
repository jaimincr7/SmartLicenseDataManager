import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICiscoSNTC } from '../../../services/hwCisco/ciscoSNTC/ciscoSNTC.model';
import { RootState } from '../../app.model';
import {
  deleteCiscoSNTC,
  getCiscoSNTCById,
  saveCiscoSNTC,
  searchCiscoSNTC,
} from './ciscoSNTC.action';
import { ICiscoSNTCState } from './ciscoSNTC.model';

export const initialState: ICiscoSNTCState = {
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

export const ciscoSNTCSlice = createSlice({
  name: 'ciscoSNTC',
  initialState,
  reducers: {
    clearCiscoSNTC: () => {
      return initialState;
    },
    clearCiscoSNTCMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCiscoSNTCGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCiscoSNTC.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCiscoSNTC.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICiscoSNTC>>
    ) => {
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
    [searchCiscoSNTC.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCiscoSNTCById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCiscoSNTCById.fulfilled.type]: (state, action: PayloadAction<ICiscoSNTC>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCiscoSNTCById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCiscoSNTC.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCiscoSNTC.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCiscoSNTC.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCiscoSNTC.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCiscoSNTC.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCiscoSNTC.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const ciscoSNTCSelector = (state: RootState) => state.ciscoSNTC;

// Actions
export const {
  clearCiscoSNTC,
  clearCiscoSNTCMessages,
  clearCiscoSNTCGetById,
  setTableColumnSelection,
} = ciscoSNTCSlice.actions;

// The reducer
export default ciscoSNTCSlice.reducer;
