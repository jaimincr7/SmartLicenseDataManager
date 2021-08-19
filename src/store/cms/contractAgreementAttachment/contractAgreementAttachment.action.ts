import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmsContractAgreementAttachment,
  ISearchCmsContractAgreementAttachment,
} from '../../../services/cms/contractAgreementAttachment/contractAgreementAttachment.model';
import contractAgreementAttachmentService from '../../../services/cms/contractAgreementAttachment/contractAgreementAttachment.service';

// Asynchronous thunk action

export const searchCmsContractAgreementAttachment = createAsyncThunk(
  'searchCmsContractAgreementAttachment',
  async (searchParam?: ISearchCmsContractAgreementAttachment) => {
    const response = await contractAgreementAttachmentService
      .searchCmsContractAgreementAttachment(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCmsContractAgreementAttachmentById = createAsyncThunk(
  'getCmsContractAgreementAttachmentById',
  async (id: number) => {
    const response = await contractAgreementAttachmentService
      .getCmsContractAgreementAttachmentById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveCmsContractAgreementAttachment = createAsyncThunk(
  'saveCmsContractAgreementAttachment',
  async (data: ICmsContractAgreementAttachment) => {
    const response = await contractAgreementAttachmentService
      .saveCmsContractAgreementAttachment(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteCmsContractAgreementAttachment = createAsyncThunk(
  'deleteCmsContractAgreementAttachment',
  async (id: number) => {
    const response = await contractAgreementAttachmentService
      .deleteCmsContractAgreementAttachment(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
