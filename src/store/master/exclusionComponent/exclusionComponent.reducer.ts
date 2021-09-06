import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { IConfigExclusionComponentState } from './exclusionComponent.model';
import {
  deleteConfigExclusionComponent,
  getConfigExclusionComponentById,
  saveConfigExclusionComponent,
  searchConfigExclusionComponent,
} from './exclusionComponent.action';
import { IConfigExclusionComponent } from '../../../services/master/exclusionComponent/exclusionComponent.model';

export const initialState: IConfigExclusionComponentState = {
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

export const configExclusionComponentSlice = createSlice({
  name: 'configExclusionComponent',
  initialState,
  reducers: {
    clearConfigExclusionComponent: () => {
      return initialState;
    },
    clearConfigExclusionComponentMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigExclusionComponentGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigExclusionComponent.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigExclusionComponent.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest };
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
    [searchConfigExclusionComponent.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigExclusionComponentById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigExclusionComponentById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigExclusionComponent>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigExclusionComponentById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigExclusionComponent.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigExclusionComponent.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigExclusionComponent.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigExclusionComponent.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigExclusionComponent.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigExclusionComponent.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configExclusionComponentSelector = (state: RootState) =>
  state.configExclusionComponent;

// Actions
export const {
  clearConfigExclusionComponent,
  clearConfigExclusionComponentMessages,
  clearConfigExclusionComponentGetById,
  setTableColumnSelection,
} = configExclusionComponentSlice.actions;

// The reducer
export default configExclusionComponentSlice.reducer;
