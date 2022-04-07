import { booleanLookup } from './../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ICompany } from '../../../services/master/company/company.model';
import { RootState } from '../../app.model';
import {
  deleteCompany,
  getCompanyById,
  purgeCompanyById,
  saveCompany,
  searchCompany,
} from './company.action';
import { ICompanyState } from './company.model';

export const initialState: ICompanyState = {
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
  purge: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearCompany: () => {
      return initialState;
    },
    clearCompanyMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
      state.purge.messages = [];
    },
    clearCompanyGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCompany.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCompany.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<ICompany>>) => {
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
    [searchCompany.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCompanyById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCompanyById.fulfilled.type]: (state, action: PayloadAction<ICompany>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCompanyById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCompany.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCompany.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCompany.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCompany.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCompany.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCompany.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },

    // Purge
    [purgeCompanyById.pending.type]: (state) => {
      state.purge.loading = true;
      state.purge.messages = [];
    },
    [purgeCompanyById.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.purge.loading = false;
      state.purge.hasErrors = false;
      state.purge.messages = action.payload.messages;
    },
    [purgeCompanyById.rejected.type]: (state) => {
      state.purge.loading = false;
      state.purge.hasErrors = true;
    },
  },
});

// A selector
export const companySelector = (state: RootState) => state.company;

// Actions
export const { clearCompany, clearCompanyMessages, clearCompanyGetById, setTableColumnSelection } =
  companySlice.actions;

// The reducer
export default companySlice.reducer;
