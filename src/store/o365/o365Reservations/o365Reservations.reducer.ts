import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { IO365Reservations } from '../../../services/o365/o365Reservations/o365Reservations.model';
import { RootState } from '../../app.model';
import {
  deleteO365Reservations,
  getO365ReservationsById,
  saveO365Reservations,
  searchO365Reservations,
} from './o365Reservations.action';
import { IO365ReservationsState } from './o365Reservations.model';

export const initialState: IO365ReservationsState = {
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

export const o365ReservationsSlice = createSlice({
  name: 'o365Reservations',
  initialState,
  reducers: {
    clearO365Reservations: () => {
      return initialState;
    },
    clearO365ReservationsMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearO365ReservationsGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchO365Reservations.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchO365Reservations.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IO365Reservations>>
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
    [searchO365Reservations.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getO365ReservationsById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getO365ReservationsById.fulfilled.type]: (state, action: PayloadAction<IO365Reservations>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getO365ReservationsById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveO365Reservations.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveO365Reservations.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveO365Reservations.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteO365Reservations.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteO365Reservations.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteO365Reservations.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const o365ReservationsSelector = (state: RootState) => state.o365Reservations;

// Actions
export const {
  clearO365Reservations,
  clearO365ReservationsMessages,
  clearO365ReservationsGetById,
  setTableColumnSelection,
} = o365ReservationsSlice.actions;

// The reducer
export default o365ReservationsSlice.reducer;
