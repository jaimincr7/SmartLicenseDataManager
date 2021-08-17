import {
  ISearchCiscoReady,
  ICiscoReady,
} from '../../../services/hwCisco/ciscoReady/ciscoReady.model';
import readyService from '../../../services/hwCisco/ciscoReady/ciscoReady.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoReady = createAsyncThunk(
  'searchCiscoReady',
  async (searchParam?: ISearchCiscoReady) => {
    const response = await readyService.searchCiscoReady(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoReadyById = createAsyncThunk('getCiscoReadyById', async (id: number) => {
  const response = await readyService.getCiscoReadyById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoReady = createAsyncThunk('saveCiscoReady', async (data: ICiscoReady) => {
  const response = await readyService.saveCiscoReady(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCiscoReady = createAsyncThunk('deleteCiscoReady', async (id: number) => {
  const response = await readyService.deleteCiscoReady(id).then((res) => {
    return res.body;
  });
  return response;
});
