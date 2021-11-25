import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICallAllApi, ISearchImportAPIs } from '../../../services/sps/spsApiCall/spsApiCall.model';
import { ICallAPI } from '../../../services/sps/spsApiCall/spsApiCall.model';
import spsApiCallService from '../../../services/sps/spsApiCall/spsApiCall.service';

// Asynchronous thunk action

export const searchImportAPIs = createAsyncThunk(
  'searchImportAPIs',
  async (searchParam?: ISearchImportAPIs) => {
    const response = await spsApiCallService.searchImportAPIs(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const checkUID = createAsyncThunk('checkUID', async (id: number) => {
  const response = await spsApiCallService.checkUID(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const callApi = createAsyncThunk('callApi', async (data: ICallAPI) => {
  const response = await spsApiCallService.callApi(data).then((res) => {
    return res.body;
  });
  return response;
});

export const callAllApi = createAsyncThunk('callAllApi', async (searchParam?: ICallAllApi) => {
  const response = await spsApiCallService.callAllApi(searchParam).then((res) => {
    return res.body;
  });
  return response;
});
