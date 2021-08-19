import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICiscoReady } from '../../../services/hwCisco/ciscoReady/ciscoReady.model';
import { RootState } from '../../app.model';
import {
  deleteCiscoReady,
  getCiscoReadyById,
  saveCiscoReady,
  searchCiscoReady,
} from './ciscoReady.action';
import { ICiscoReadyState } from './ciscoReady.model';

export const initialState: ICiscoReadyState = {
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

export const ciscoReadySlice = createSlice({
  name: 'ciscoReady',
  initialState,
  reducers: {
    clearCiscoReady: () => {
      return initialState;
    },
    clearCiscoReadyMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCiscoReadyGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCiscoReady.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCiscoReady.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICiscoReady>>
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
    [searchCiscoReady.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCiscoReadyById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCiscoReadyById.fulfilled.type]: (state, action: PayloadAction<ICiscoReady>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCiscoReadyById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCiscoReady.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCiscoReady.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCiscoReady.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCiscoReady.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCiscoReady.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCiscoReady.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const ciscoReadySelector = (state: RootState) => state.ciscoReady;

// Actions
export const {
  clearCiscoReady,
  clearCiscoReadyMessages,
  clearCiscoReadyGetById,
  setTableColumnSelection,
} = ciscoReadySlice.actions;

// The reducer
export default ciscoReadySlice.reducer;
