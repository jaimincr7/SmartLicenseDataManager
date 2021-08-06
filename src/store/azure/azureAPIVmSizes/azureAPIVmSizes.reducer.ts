import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { IAzureAPIVmSizes } from '../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.model';
import { RootState } from '../../app.model';
import {
  searchAzureAPIVmSizes,
  getAzureAPIVmSizesById,
  saveAzureAPIVmSizes,
  deleteAzureAPIVmSizes,
} from './azureAPIVmSizes.action';
import { IAzureAPIVmSizesState } from './azureAPIVmSizes.model';

export const initialState: IAzureAPIVmSizesState = {
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

export const azureAPIVmSizesSlice = createSlice({
  name: 'azureAPIVmSizes',
  initialState,
  reducers: {
    clearAzureAPIVmSizes: () => {
      return initialState;
    },
    clearAzureAPIVmSizesMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearAzureAPIVmSizesGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAzureAPIVmSizes.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAzureAPIVmSizes.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchAzureAPIVmSizes.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getAzureAPIVmSizesById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAzureAPIVmSizesById.fulfilled.type]: (state, action: PayloadAction<IAzureAPIVmSizes>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAzureAPIVmSizesById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAzureAPIVmSizes.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAzureAPIVmSizes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAzureAPIVmSizes.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAzureAPIVmSizes.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAzureAPIVmSizes.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAzureAPIVmSizes.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const azureAPIVmSizesSelector = (state: RootState) => state.azureAPIVmSizes;

// Actions
export const {
  clearAzureAPIVmSizes,
  clearAzureAPIVmSizesMessages,
  clearAzureAPIVmSizesGetById,
  setTableColumnSelection,
} = azureAPIVmSizesSlice.actions;

// The reducer
export default azureAPIVmSizesSlice.reducer;
