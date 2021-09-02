import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbExclusion,
  ISearchCmdbExclusion,
} from '../../../services/cmdb/exclusion/exclusion.model';
import exclusionService from '../../../services/cmdb/exclusion/exclusion.service';

// Asynchronous thunk action

export const searchCmdbExclusion = createAsyncThunk(
  'searchCmdbExclusion',
  async (searchParam?: ISearchCmdbExclusion) => {
    const response = await exclusionService.searchCmdbExclusion(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbExclusionById = createAsyncThunk('getCmdbExclusionById', async (id: number) => {
  const response = await exclusionService.getCmdbExclusionById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmdbExclusion = createAsyncThunk(
  'saveCmdbExclusion',
  async (data: ICmdbExclusion) => {
    const response = await exclusionService.saveCmdbExclusion(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbExclusion = createAsyncThunk('deleteCmdbExclusion', async (id: number) => {
  const response = await exclusionService.deleteCmdbExclusion(id).then((res) => {
    return res.body;
  });
  return response;
});
