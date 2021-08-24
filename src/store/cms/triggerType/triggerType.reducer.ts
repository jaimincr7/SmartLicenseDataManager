import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsTriggerTypeState } from './triggerType.model';
import {
  deleteCmsTriggerType,
  getCmsTriggerTypeById,
  saveCmsTriggerType,
  searchCmsTriggerType,
} from './triggerType.action';
import { ICmsTriggerType } from '../../../services/cms/triggerType/triggerType.model';

export const initialState: ICmsTriggerTypeState = {
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

export const cmsTriggerTypeSlice = createSlice({
  name: 'cmsTriggerType',
  initialState,
  reducers: {
    clearCmsTriggerType: () => {
      return initialState;
    },
    clearCmsTriggerTypeMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsTriggerTypeGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsTriggerType.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsTriggerType.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
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
    [searchCmsTriggerType.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsTriggerTypeById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsTriggerTypeById.fulfilled.type]: (state, action: PayloadAction<ICmsTriggerType>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsTriggerTypeById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsTriggerType.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsTriggerType.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsTriggerType.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsTriggerType.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsTriggerType.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsTriggerType.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsTriggerTypeSelector = (state: RootState) => state.cmsTriggerType;

// Actions
export const {
  clearCmsTriggerType,
  clearCmsTriggerTypeMessages,
  clearCmsTriggerTypeGetById,
  setTableColumnSelection,
} = cmsTriggerTypeSlice.actions;

// The reducer
export default cmsTriggerTypeSlice.reducer;
