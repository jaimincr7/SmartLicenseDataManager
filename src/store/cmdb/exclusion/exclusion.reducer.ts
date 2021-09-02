import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { booleanLookup } from '../../../common/constants/common';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmdbExclusionState } from './exclusion.model';
import {
  deleteCmdbExclusion,
  getCmdbExclusionById,
  saveCmdbExclusion,
  searchCmdbExclusion,
} from './exclusion.action';
import { ICmdbExclusion } from '../../../services/cmdb/exclusion/exclusion.model';

export const initialState: ICmdbExclusionState = {
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

export const cmdbExclusionSlice = createSlice({
  name: 'cmdbExclusion',
  initialState,
  reducers: {
    clearCmdbExclusion: () => {
      return initialState;
    },
    clearCmdbExclusionMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmdbExclusionGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmdbExclusion.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmdbExclusion.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchCmdbExclusion.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmdbExclusionById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmdbExclusionById.fulfilled.type]: (state, action: PayloadAction<ICmdbExclusion>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmdbExclusionById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmdbExclusion.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmdbExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmdbExclusion.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmdbExclusion.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmdbExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmdbExclusion.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmdbExclusionSelector = (state: RootState) => state.cmdbExclusion;

// Actions
export const {
  clearCmdbExclusion,
  clearCmdbExclusionMessages,
  clearCmdbExclusionGetById,
  setTableColumnSelection,
} = cmdbExclusionSlice.actions;

// The reducer
export default cmdbExclusionSlice.reducer;
