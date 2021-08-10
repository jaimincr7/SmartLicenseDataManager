import { ISearchCiscoIB, ICiscoIB } from '../../../services/hwCisco/ciscoIB/ciscoIB.model';
import siteMatrixService from '../../../services/hwCisco/ciscoIB/ciscoIB.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoIB = createAsyncThunk(
  'searchCiscoIB',
  async (searchParam?: ISearchCiscoIB) => {
    const response = await siteMatrixService.searchCiscoIB(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoIBById = createAsyncThunk('getCiscoIBById', async (id: number) => {
  const response = await siteMatrixService.getCiscoIBById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoIB = createAsyncThunk('saveCiscoIB', async (data: ICiscoIB) => {
  const response = await siteMatrixService.saveCiscoIB(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCiscoIB = createAsyncThunk('deleteCiscoIB', async (id: number) => {
  const response = await siteMatrixService.deleteCiscoIB(id).then((res) => {
    return res.body;
  });
  return response;
});
