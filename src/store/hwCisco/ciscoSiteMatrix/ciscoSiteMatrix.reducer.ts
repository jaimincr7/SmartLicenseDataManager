import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICiscoSiteMatrix } from '../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.model';
import { RootState } from '../../app.model';
import {
  deleteCiscoSiteMatrix,
  getCiscoSiteMatrixById,
  saveCiscoSiteMatrix,
  searchCiscoSiteMatrix,
} from './ciscoSiteMatrix.action';
import { ICiscoSiteMatrixState } from './ciscoSiteMatrix.model';

export const initialState: ICiscoSiteMatrixState = {
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

export const ciscoSiteMatrixSlice = createSlice({
  name: 'ciscoSiteMatrix',
  initialState,
  reducers: {
    clearCiscoSiteMatrix: () => {
      return initialState;
    },
    clearCiscoSiteMatrixMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCiscoSiteMatrixGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCiscoSiteMatrix.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCiscoSiteMatrix.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICiscoSiteMatrix>>
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
    [searchCiscoSiteMatrix.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCiscoSiteMatrixById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCiscoSiteMatrixById.fulfilled.type]: (state, action: PayloadAction<ICiscoSiteMatrix>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCiscoSiteMatrixById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCiscoSiteMatrix.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCiscoSiteMatrix.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCiscoSiteMatrix.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCiscoSiteMatrix.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCiscoSiteMatrix.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCiscoSiteMatrix.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const ciscoSiteMatrixSelector = (state: RootState) => state.ciscoSiteMatrix;

// Actions
export const {
  clearCiscoSiteMatrix,
  clearCiscoSiteMatrixMessages,
  clearCiscoSiteMatrixGetById,
  setTableColumnSelection,
} = ciscoSiteMatrixSlice.actions;

// The reducer
export default ciscoSiteMatrixSlice.reducer;
