import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchSpsApiJobs, ISpsApiJobs } from '../../../services/sps/spsApiJobs/spsApiJobs.model';
import spsApiJobsService from '../../../services/sps/spsApiJobs/spsApiJobs.service';

// Asynchronous thunk action

export const searchSpsApiJobs = createAsyncThunk(
  'searchSpsApiJobs',
  async (searchParam?: ISearchSpsApiJobs) => {
    const response = await spsApiJobsService.searchSpsApiJobs(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiJobsById = createAsyncThunk('getSpsApiJobsById', async (id: number) => {
  const response = await spsApiJobsService.getSpsApiJobsById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApiJobs = createAsyncThunk('saveSpsApiJobs', async (data: ISpsApiJobs) => {
  const response = await spsApiJobsService.saveSpsApiJobs(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSpsApiJobs = createAsyncThunk('deleteSpsApiJobs', async (id: number) => {
  const response = await spsApiJobsService.deleteSpsApiJobs(id).then((res) => {
    return res.body;
  });
  return response;
});
