import { ISearchCiscoHost, ICiscoHost } from '../../../services/hwCisco/ciscoHost/ciscoHost.model';
import siteMatrixService from '../../../services/hwCisco/ciscoHost/ciscoHost.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoHost = createAsyncThunk(
  'searchCiscoHost',
  async (searchParam?: ISearchCiscoHost) => {
    const response = await siteMatrixService.searchCiscoHost(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoHostById = createAsyncThunk('getCiscoHostById', async (id: number) => {
  const response = await siteMatrixService.getCiscoHostById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoHost = createAsyncThunk('saveCiscoHost', async (data: ICiscoHost) => {
  const response = await siteMatrixService.saveCiscoHost(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCiscoHost = createAsyncThunk('deleteCiscoHost', async (id: number) => {
  const response = await siteMatrixService.deleteCiscoHost(id).then((res) => {
    return res.body;
  });
  return response;
});
