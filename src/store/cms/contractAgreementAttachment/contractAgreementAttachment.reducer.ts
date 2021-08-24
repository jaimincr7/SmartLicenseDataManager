import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsContractAgreementAttachmentState } from './contractAgreementAttachment.model';
import {
  deleteCmsContractAgreementAttachment,
  getCmsContractAgreementAttachmentById,
  saveCmsContractAgreementAttachment,
  searchCmsContractAgreementAttachment,
} from './contractAgreementAttachment.action';
import { ICmsContractAgreementAttachment } from '../../../services/cms/contractAgreementAttachment/contractAgreementAttachment.model';

export const initialState: ICmsContractAgreementAttachmentState = {
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

export const cmsContractAgreementAttachmentSlice = createSlice({
  name: 'cmsContractAgreementAttachment',
  initialState,
  reducers: {
    clearCmsContractAgreementAttachment: () => {
      return initialState;
    },
    clearCmsContractAgreementAttachmentMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsContractAgreementAttachmentGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsContractAgreementAttachment.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsContractAgreementAttachment.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICmsContractAgreementAttachment>>
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
    [searchCmsContractAgreementAttachment.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsContractAgreementAttachmentById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsContractAgreementAttachmentById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmsContractAgreementAttachment>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsContractAgreementAttachmentById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsContractAgreementAttachment.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsContractAgreementAttachment.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsContractAgreementAttachment.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsContractAgreementAttachment.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsContractAgreementAttachment.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsContractAgreementAttachment.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsContractAgreementAttachmentSelector = (state: RootState) =>
  state.cmsContractAgreementAttachment;

// Actions
export const {
  clearCmsContractAgreementAttachment,
  clearCmsContractAgreementAttachmentMessages,
  clearCmsContractAgreementAttachmentGetById,
  setTableColumnSelection,
} = cmsContractAgreementAttachmentSlice.actions;

// The reducer
export default cmsContractAgreementAttachmentSlice.reducer;
