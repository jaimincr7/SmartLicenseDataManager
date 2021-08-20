import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICiscoSpectrum } from '../../../services/hwCisco/ciscoSpectrum/ciscoSpectrum.model';
import { RootState } from '../../app.model';
import {
  deleteCiscoSpectrum,
  getCiscoSpectrumById,
  saveCiscoSpectrum,
  searchCiscoSpectrum,
} from './ciscoSpectrum.action';
import { ICiscoSpectrumState } from './ciscoSpectrum.model';

export const initialState: ICiscoSpectrumState = {
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

export const ciscoSpectrumSlice = createSlice({
  name: 'ciscoSpectrum',
  initialState,
  reducers: {
    clearCiscoSpectrum: () => {
      return initialState;
    },
    clearCiscoSpectrumMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCiscoSpectrumGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCiscoSpectrum.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCiscoSpectrum.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICiscoSpectrum>>
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
    [searchCiscoSpectrum.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCiscoSpectrumById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCiscoSpectrumById.fulfilled.type]: (state, action: PayloadAction<ICiscoSpectrum>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCiscoSpectrumById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCiscoSpectrum.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCiscoSpectrum.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCiscoSpectrum.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCiscoSpectrum.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCiscoSpectrum.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCiscoSpectrum.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const ciscoSpectrumSelector = (state: RootState) => state.ciscoSpectrum;

// Actions
export const {
  clearCiscoSpectrum,
  clearCiscoSpectrumMessages,
  clearCiscoSpectrumGetById,
  setTableColumnSelection,
} = ciscoSpectrumSlice.actions;

// The reducer
export default ciscoSpectrumSlice.reducer;
