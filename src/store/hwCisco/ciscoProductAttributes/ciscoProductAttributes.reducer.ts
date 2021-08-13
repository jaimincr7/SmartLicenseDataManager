import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICiscoProductAttributes } from '../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.model';
import { RootState } from '../../app.model';
import {
  deleteCiscoProductAttributes,
  getCiscoProductAttributesById,
  saveCiscoProductAttributes,
  searchCiscoProductAttributes,
} from './ciscoProductAttributes.action';
import { ICiscoProductAttributesState } from './ciscoProductAttributes.model';

export const initialState: ICiscoProductAttributesState = {
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

export const ciscoProductAttributesSlice = createSlice({
  name: 'ciscoProductAttributes',
  initialState,
  reducers: {
    clearCiscoProductAttributes: () => {
      return initialState;
    },
    clearCiscoProductAttributesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCiscoProductAttributesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCiscoProductAttributes.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCiscoProductAttributes.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICiscoProductAttributes>>
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
        state.tableColumnSelection.columns = JSON.parse(
          search_result.column_selection.columns as any
        );
      }
      state.tableColumnSelection.table_name = search_result.table_name;
    },
    [searchCiscoProductAttributes.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCiscoProductAttributesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCiscoProductAttributesById.fulfilled.type]: (
      state,
      action: PayloadAction<ICiscoProductAttributes>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCiscoProductAttributesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCiscoProductAttributes.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCiscoProductAttributes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCiscoProductAttributes.rejected.type]: (
      state,
    ) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCiscoProductAttributes.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCiscoProductAttributes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCiscoProductAttributes.rejected.type]: (
      state,
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const ciscoProductAttributesSelector = (state: RootState) => state.ciscoProductAttributes;

// Actions
export const {
  clearCiscoProductAttributes,
  clearCiscoProductAttributesMessages,
  clearCiscoProductAttributesGetById,
  setTableColumnSelection,
} = ciscoProductAttributesSlice.actions;

// The reducer
export default ciscoProductAttributesSlice.reducer;
