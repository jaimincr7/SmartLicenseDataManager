import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IAgreementTypesState } from './agreementTypes.model';
import {
  deleteAgreementTypes,
  getAgreementTypesById,
  saveAgreementTypes,
  searchAgreementTypes,
} from './agreementTypes.action';
import { IAgreementTypes } from '../../../services/master/agreementTypes/agreementTypes.model';

export const initialState: IAgreementTypesState = {
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

export const agreementTypesSlice = createSlice({
  name: 'agreementTypes',
  initialState,
  reducers: {
    clearAgreementTypes: () => {
      return initialState;
    },
    clearAgreementTypesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearAgreementTypesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAgreementTypes.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAgreementTypes.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchAgreementTypes.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAgreementTypesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAgreementTypesById.fulfilled.type]: (state, action: PayloadAction<IAgreementTypes>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAgreementTypesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAgreementTypes.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAgreementTypes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAgreementTypes.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAgreementTypes.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAgreementTypes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAgreementTypes.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const agreementTypesSelector = (state: RootState) => state.agreementTypes;

// Actions
export const {
  clearAgreementTypes,
  clearAgreementTypesMessages,
  clearAgreementTypesGetById,
  setTableColumnSelection,
} = agreementTypesSlice.actions;

// The reducer
export default agreementTypesSlice.reducer;
