import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchImportAPIs } from '../../../services/sps/spsApi/sps.model';
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
