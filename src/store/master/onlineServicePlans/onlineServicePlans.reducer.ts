import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigOnlineServicePlansState } from './onlineServicePlans.model';
import {
  deleteConfigOnlineServicePlans,
  getConfigOnlineServicePlansById,
  saveConfigOnlineServicePlans,
  searchConfigOnlineServicePlans,
} from './onlineServicePlans.action';
import { IConfigOnlineServicePlans } from '../../../services/master/onlineServicePlans/onlineServicePlans.model';

export const initialState: IConfigOnlineServicePlansState = {
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

export const configOnlineServicePlansSlice = createSlice({
  name: 'configOnlineServicePlans',
  initialState,
  reducers: {
    clearConfigOnlineServicePlans: () => {
      return initialState;
    },
    clearConfigOnlineServicePlansMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigOnlineServicePlansGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigOnlineServicePlans.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigOnlineServicePlans.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigOnlineServicePlans.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigOnlineServicePlansById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigOnlineServicePlansById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigOnlineServicePlans>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigOnlineServicePlansById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigOnlineServicePlans.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigOnlineServicePlans.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigOnlineServicePlans.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigOnlineServicePlans.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigOnlineServicePlans.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigOnlineServicePlans.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configOnlineServicePlansSelector = (state: RootState) =>
  state.configOnlineServicePlans;

// Actions
export const {
  clearConfigOnlineServicePlans,
  clearConfigOnlineServicePlansMessages,
  clearConfigOnlineServicePlansGetById,
  setTableColumnSelection,
} = configOnlineServicePlansSlice.actions;

// The reducer
export default configOnlineServicePlansSlice.reducer;
