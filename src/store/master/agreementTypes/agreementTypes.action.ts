import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IAgreementTypes,
  ISearchAgreementTypes,
} from '../../../services/master/agreementTypes/agreementTypes.model';
import agreementTypesService from '../../../services/master/agreementTypes/agreementTypes.service';

// Asynchronous thunk action

export const searchAgreementTypes = createAsyncThunk(
  'searchAgreementTypes',
  async (searchParam?: ISearchAgreementTypes) => {
    const response = await agreementTypesService.searchAgreementTypes(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAgreementTypesById = createAsyncThunk(
  'getAgreementTypesById',
  async (id: number) => {
    const response = await agreementTypesService.getAgreementTypesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveAgreementTypes = createAsyncThunk(
  'saveAgreementTypes',
  async (data: IAgreementTypes) => {
    const response = await agreementTypesService.saveAgreementTypes(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteAgreementTypes = createAsyncThunk('deleteAgreementTypes', async (id: number) => {
  const response = await agreementTypesService.deleteAgreementTypes(id).then((res) => {
    return res.body;
  });
  return response;
});
