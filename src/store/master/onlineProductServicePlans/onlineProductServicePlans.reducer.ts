import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigOnlineProductServicePlansState } from './onlineProductServicePlans.model';
import {
  deleteConfigOnlineProductServicePlans,
  getConfigOnlineProductServicePlansById,
  saveConfigOnlineProductServicePlans,
  searchConfigOnlineProductServicePlans,
} from './onlineProductServicePlans.action';
import { IConfigOnlineProductServicePlans } from '../../../services/master/onlineProductServicePlans/onlineProductServicePlans.model';

export const initialState: IConfigOnlineProductServicePlansState = {
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

export const configOnlineProductServicePlansSlice = createSlice({
  name: 'configOnlineProductServicePlans',
  initialState,
  reducers: {
    clearConfigOnlineProductServicePlans: () => {
      return initialState;
    },
    clearConfigOnlineProductServicePlansMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigOnlineProductServicePlansGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigOnlineProductServicePlans.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigOnlineProductServicePlans.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigOnlineProductServicePlans.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigOnlineProductServicePlansById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigOnlineProductServicePlansById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigOnlineProductServicePlans>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigOnlineProductServicePlansById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigOnlineProductServicePlans.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigOnlineProductServicePlans.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigOnlineProductServicePlans.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigOnlineProductServicePlans.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigOnlineProductServicePlans.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigOnlineProductServicePlans.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configOnlineProductServicePlansSelector = (state: RootState) =>
  state.configOnlineProductServicePlans;

// Actions
export const {
  clearConfigOnlineProductServicePlans,
  clearConfigOnlineProductServicePlansMessages,
  clearConfigOnlineProductServicePlansGetById,
  setTableColumnSelection,
} = configOnlineProductServicePlansSlice.actions;

// The reducer
export default configOnlineProductServicePlansSlice.reducer;
