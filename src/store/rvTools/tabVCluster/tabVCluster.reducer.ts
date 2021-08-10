import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ITabVCluster } from '../../../services/rvTools/tabVCluster/tabVCluster.model';
import { RootState } from '../../app.model';
import {
  searchTabVCluster,
  getTabVClusterById,
  saveTabVCluster,
  deleteTabVCluster,
} from './tabVCluster.action';
import { ITabVClusterState } from './tabVCluster.model';

export const initialState: ITabVClusterState = {
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

export const tabVClusterSlice = createSlice({
  name: 'tabVCluster',
  initialState,
  reducers: {
    clearTabVCluster: () => {
      return initialState;
    },
    clearTabVClusterMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearTabVClusterGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchTabVCluster.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchTabVCluster.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ITabVCluster>>
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
    [searchTabVCluster.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getTabVClusterById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getTabVClusterById.fulfilled.type]: (state, action: PayloadAction<ITabVCluster>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getTabVClusterById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveTabVCluster.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveTabVCluster.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveTabVCluster.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteTabVCluster.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteTabVCluster.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteTabVCluster.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const tabVClusterSelector = (state: RootState) => state.tabVCluster;

// Actions
export const {
  clearTabVCluster,
  clearTabVClusterMessages,
  clearTabVClusterGetById,
  setTableColumnSelection,
} = tabVClusterSlice.actions;

// The reducer
export default tabVClusterSlice.reducer;
