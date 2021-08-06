import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { IAzureRateCard } from '../../../services/azure/azureRateCard/azureRateCard.model';
import { RootState } from '../../app.model';
import {
  searchAzureRateCard,
  getAzureRateCardById,
  saveAzureRateCard,
  deleteAzureRateCard,
} from './azureRateCard.action';
import { IAzureRateCardState } from './azureRateCard.model';

export const initialState: IAzureRateCardState = {
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

export const azureRateCardSlice = createSlice({
  name: 'azureRateCard',
  initialState,
  reducers: {
    clearAzureRateCard: () => {
      return initialState;
    },
    clearAzureRateCardMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearAzureRateCardGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAzureRateCard.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAzureRateCard.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchAzureRateCard.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAzureRateCardById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAzureRateCardById.fulfilled.type]: (state, action: PayloadAction<IAzureRateCard>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAzureRateCardById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAzureRateCard.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAzureRateCard.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAzureRateCard.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAzureRateCard.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAzureRateCard.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAzureRateCard.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const azureRateCardSelector = (state: RootState) => state.azureRateCard;

// Actions
export const {
  clearAzureRateCard,
  clearAzureRateCardMessages,
  clearAzureRateCardGetById,
  setTableColumnSelection,
} = azureRateCardSlice.actions;

// The reducer
export default azureRateCardSlice.reducer;
