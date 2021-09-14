import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICallAPI,
  ISearchSpsApiJobsData,
} from '../../../services/sps/spsApiJobsData/spsApiJobsData.model';
import spsApiJobsDataService from '../../../services/sps/spsApiJobsData/spsApiJobsData.service';

// Asynchronous thunk action

export const searchSpsApiJobsData = createAsyncThunk(
  'searchSpsApiJobsData',
  async (searchParam?: ISearchSpsApiJobsData) => {
    const response = await spsApiJobsDataService.searchSpsApiJobsData(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const runJobData = createAsyncThunk('runJobData', async (data: ICallAPI) => {
  const response = await spsApiJobsDataService.runJobData(data).then((res) => {
    return res.body;
  });
  return response;
});
