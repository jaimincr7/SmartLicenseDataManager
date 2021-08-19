import { ISearchCiscoSNTC, ICiscoSNTC } from '../../../services/hwCisco/ciscoSNTC/ciscoSNTC.model';
import sntcService from '../../../services/hwCisco/ciscoSNTC/ciscoSNTC.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoSNTC = createAsyncThunk(
  'searchCiscoSNTC',
  async (searchParam?: ISearchCiscoSNTC) => {
    const response = await sntcService.searchCiscoSNTC(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoSNTCById = createAsyncThunk('getCiscoSNTCById', async (id: number) => {
  const response = await sntcService.getCiscoSNTCById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoSNTC = createAsyncThunk('saveCiscoSNTC', async (data: ICiscoSNTC) => {
  const response = await sntcService.saveCiscoSNTC(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCiscoSNTC = createAsyncThunk('deleteCiscoSNTC', async (id: number) => {
  const response = await sntcService.deleteCiscoSNTC(id).then((res) => {
    return res.body;
  });
  return response;
});
