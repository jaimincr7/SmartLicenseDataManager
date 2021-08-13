import {
  ISearchCiscoPolicy,
  ICiscoPolicy,
} from '../../../services/hwCisco/ciscoPolicy/ciscoPolicy.model';
import siteMatrixService from '../../../services/hwCisco/ciscoPolicy/ciscoPolicy.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoPolicy = createAsyncThunk(
  'searchCiscoPolicy',
  async (searchParam?: ISearchCiscoPolicy) => {
    const response = await siteMatrixService.searchCiscoPolicy(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoPolicyById = createAsyncThunk('getCiscoPolicyById', async (id: number) => {
  const response = await siteMatrixService.getCiscoPolicyById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoPolicy = createAsyncThunk('saveCiscoPolicy', async (data: ICiscoPolicy) => {
  const response = await siteMatrixService.saveCiscoPolicy(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCiscoPolicy = createAsyncThunk('deleteCiscoPolicy', async (id: number) => {
  const response = await siteMatrixService.deleteCiscoPolicy(id).then((res) => {
    return res.body;
  });
  return response;
});
