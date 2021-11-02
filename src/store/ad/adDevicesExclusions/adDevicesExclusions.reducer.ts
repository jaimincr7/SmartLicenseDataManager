import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import {
  deleteAdDevicesExclusions,
  getAdDevicesExclusionsById,
  getAdDevicesExclusionsFieldLookup,
  saveAdDevicesExclusions,
  searchAdDevicesExclusions,
} from './adDevicesExclusions.action';
import { IAdDevicesExclusionsState } from './adDevicesExclusions.model';
import { IAdDevicesExclusions } from '../../../services/ad/adDevicesExclusions/adDevicesExclusions.model';
import { ILookup } from '../../../services/common/common.model';

export const initialState: IAdDevicesExclusionsState = {
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
  fieldLookup: {
    data: [],
    loading: false,
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

export const adDevicesExclusionsSlice = createSlice({
  name: 'adDevicesExclusions',
  initialState,
  reducers: {
    clearAdDevicesExclusions: () => {
      return initialState;
    },
    clearAdDevicesExclusionsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearAdDevicesExclusionsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAdDevicesExclusions.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAdDevicesExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IAdDevicesExclusions>>
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
    [searchAdDevicesExclusions.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    //Field Lookoup
    [getAdDevicesExclusionsFieldLookup.pending.type]: (state) => {
      state.fieldLookup.loading = true;
    },
    [getAdDevicesExclusionsFieldLookup.fulfilled.type]: (
      state,
      action: PayloadAction<ILookup[]>
    ) => {
      state.fieldLookup.data = action.payload;
      state.fieldLookup.loading = false;
    },

    // Get by id
    [getAdDevicesExclusionsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAdDevicesExclusionsById.fulfilled.type]: (
      state,
      action: PayloadAction<IAdDevicesExclusions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAdDevicesExclusionsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAdDevicesExclusions.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAdDevicesExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAdDevicesExclusions.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAdDevicesExclusions.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAdDevicesExclusions.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAdDevicesExclusions.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const adDevicesExclusionsSelector = (state: RootState) => state.adDevicesExclusions;

// Actions
export const {
  clearAdDevicesExclusions,
  clearAdDevicesExclusionsMessages,
  clearAdDevicesExclusionsGetById,
  setTableColumnSelection,
} = adDevicesExclusionsSlice.actions;

// The reducer
export default adDevicesExclusionsSlice.reducer;
