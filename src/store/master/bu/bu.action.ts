import { IBU, ISearchBU } from '../../../services/master/bu/bu.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import buService from '../../../services/master/bu/bu.service';

// Asynchronous thunk action

export const searchBU = createAsyncThunk('searchBU', async (searchParam?: ISearchBU) => {
  const response = await buService.searchBU(searchParam).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getBUById = createAsyncThunk('getBUById', async (id: number) => {
  const response = await buService.getBUById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveBU = createAsyncThunk('saveBU', async (data: IBU) => {
  const response = await buService.saveBU(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteBU = createAsyncThunk('deleteBU', async (id: number) => {
  const response = await buService.deleteBU(id).then((res) => {
    return res.body;
  });
  return response;
});
