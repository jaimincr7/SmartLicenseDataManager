import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ITabVInfo } from '../../../services/rvTools/tabVInfo/tabVInfo.model';
import { RootState } from '../../app.model';
import { searchTabVInfo, getTabVInfoById, saveTabVInfo, deleteTabVInfo } from './tabVInfo.action';
import { ITabVInfoState } from './tabVInfo.model';

export const initialState: ITabVInfoState = {
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

export const tabVInfoSlice = createSlice({
  name: 'tabVInfo',
  initialState,
  reducers: {
    clearTabVInfo: () => {
      return initialState;
    },
    clearTabVInfoMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearTabVInfoGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchTabVInfo.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchTabVInfo.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<ITabVInfo>>) => {
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
    [searchTabVInfo.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getTabVInfoById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getTabVInfoById.fulfilled.type]: (state, action: PayloadAction<ITabVInfo>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getTabVInfoById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveTabVInfo.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveTabVInfo.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveTabVInfo.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteTabVInfo.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteTabVInfo.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteTabVInfo.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const tabVInfoSelector = (state: RootState) => state.tabVInfo;

// Actions
export const {
  clearTabVInfo,
  clearTabVInfoMessages,
  clearTabVInfoGetById,
  setTableColumnSelection,
} = tabVInfoSlice.actions;

// The reducer
export default tabVInfoSlice.reducer;
