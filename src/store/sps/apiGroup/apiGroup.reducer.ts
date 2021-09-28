import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { ISpsApiGroupState } from './apiGroup.model';
import {
  deleteSpsApiGroup,
  getSpsApiGroupById,
  saveSpsApiGroup,
  searchSpsApiGroup,
} from './apiGroup.action';
import { ISpsApiGroup } from '../../../services/sps/apiGroup/apiGroup.model';

export const initialState: ISpsApiGroupState = {
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

export const spsApiGroupSlice = createSlice({
  name: 'spsApiGroup',
  initialState,
  reducers: {
    clearSpsApiGroup: () => {
      return initialState;
    },
    clearSpsApiGroupMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearSpsApiGroupGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSpsApiGroup.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSpsApiGroup.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      if (column_selection) {
        state.tableColumnSelection.id = column_selection.id;
        const tableSelectionObj = JSON.parse(column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = table_name;
    },
    [searchSpsApiGroup.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getSpsApiGroupById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSpsApiGroupById.fulfilled.type]: (state, action: PayloadAction<ISpsApiGroup>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSpsApiGroupById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSpsApiGroup.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSpsApiGroup.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSpsApiGroup.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSpsApiGroup.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSpsApiGroup.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSpsApiGroup.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const spsApiGroupSelector = (state: RootState) => state.spsApiGroup;

// Actions
export const {
  clearSpsApiGroup,
  clearSpsApiGroupMessages,
  clearSpsApiGroupGetById,
  setTableColumnSelection,
} = spsApiGroupSlice.actions;

// The reducer
export default spsApiGroupSlice.reducer;
