import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ISqlServerExclusions } from '../../../services/sqlServer/sqlServerExclusions/sqlServerExclusions.model';
import { RootState } from '../../app.model';
import {
  deleteSqlServerExclusions,
  getFieldLookups,
  getSqlServerExclusionsById,
  processDataSqlServerExclusion,
  saveSqlServerExclusions,
  searchSqlServerExclusions,
} from './sqlServerExclusions.action';
import { ISqlServerExclusionsState } from './sqlServerExclusions.model';
import { ILookup } from '../../../services/common/common.model';

export const initialState: ISqlServerExclusionsState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
  },
  fieldLookup: {
    data: [],
    loading: false,
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
  processData: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const sqlServerExclusionsSlice = createSlice({
  name: 'sqlServerExclusions',
  initialState,
  reducers: {
    clearSqlServerExclusions: () => {
      return initialState;
    },
    clearSqlServerExclusionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.processData.messages = [];
    },
    clearSqlServerExclusionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchSqlServerExclusions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchSqlServerExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ISqlServerExclusions>>
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
    [searchSqlServerExclusions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    //Field Lookup
    [getFieldLookups.pending.type]: (state) => {
      state.fieldLookup.loading = true;
    },
    [getFieldLookups.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.fieldLookup.data = action.payload;
      state.fieldLookup.loading = false;
    },

    // Get by id
    [getSqlServerExclusionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getSqlServerExclusionsById.fulfilled.type]: (
      state,
      action: PayloadAction<ISqlServerExclusions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getSqlServerExclusionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveSqlServerExclusions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveSqlServerExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveSqlServerExclusions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteSqlServerExclusions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteSqlServerExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteSqlServerExclusions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Process Data
    [processDataSqlServerExclusion.pending.type]: (state) => {
      state.processData.loading = true;
      state.processData.messages = [];
    },
    [processDataSqlServerExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.processData.loading = false;
      state.processData.hasErrors = false;
      state.processData.messages = action.payload.messages;
    },
    [processDataSqlServerExclusion.rejected.type]: (state) => {
      state.processData.loading = false;
      state.processData.hasErrors = true;
    },
  },
});

// A selector
export const sqlServerExclusionsSelector = (state: RootState) => state.sqlServerExclusions;

// Actions
export const {
  clearSqlServerExclusions,
  clearSqlServerExclusionsMessages,
  clearSqlServerExclusionsGetById,
  setTableColumnSelection,
} = sqlServerExclusionsSlice.actions;

// The reducer
export default sqlServerExclusionsSlice.reducer;
