import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmsContractAgreement,
  ISearchCmsContractAgreement,
} from '../../../services/cms/contractAgreement/contractAgreement.model';
import contractAgreementService from '../../../services/cms/contractAgreement/contractAgreement.service';

// Asynchronous thunk action

export const searchCmsContractAgreement = createAsyncThunk(
  'searchCmsContractAgreement',
  async (searchParam?: ISearchCmsContractAgreement) => {
    const response = await contractAgreementService
      .searchCmsContractAgreement(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCmsContractAgreementById = createAsyncThunk(
  'getCmsContractAgreementById',
  async (id: number) => {
    const response = await contractAgreementService.getCmsContractAgreementById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmsContractAgreement = createAsyncThunk(
  'saveCmsContractAgreement',
  async (data: ICmsContractAgreement) => {
    const response = await contractAgreementService.saveCmsContractAgreement(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmsContractAgreement = createAsyncThunk(
  'deleteCmsContractAgreement',
  async (id: number) => {
    const response = await contractAgreementService.deleteCmsContractAgreement(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
