import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICallAllApi, ISearchImportAPIs, ISpsApi } from '../../../services/sps/spsApi/sps.model';
import { ICallAPI } from '../../../services/sps/spsApi/sps.model';
import spsService from '../../../services/sps/spsApi/sps.service';

// Asynchronous thunk action

export const searchImportAPIs = createAsyncThunk(
  'searchImportAPIs',
  async (searchParam?: ISearchImportAPIs) => {
    const response = await spsService.searchImportAPIs(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const callApi = createAsyncThunk('callApi', async (data: ICallAPI) => {
  const response = await spsService.callApi(data).then((res) => {
    return res.body;
  });
  return response;
});

export const callAllApi = createAsyncThunk('callAllApi', async (searchParam?: ICallAllApi) => {
  const response = await spsService.callAllApi(searchParam).then((res) => {
    return res.body;
  });
  return response;
});

export const getSpsApiById = createAsyncThunk('getSpsApiById', async (id: number) => {
  const response = await spsService.getSpsApiById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApi = createAsyncThunk('saveSpsApi', async (data: ISpsApi) => {
  const response = await spsService.saveSpsApi(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSpsApi = createAsyncThunk('deleteSpsApi', async (id: number) => {
  const response = await spsService.deleteSpsApi(id).then((res) => {
    return res.body;
  });
  return response;
});
