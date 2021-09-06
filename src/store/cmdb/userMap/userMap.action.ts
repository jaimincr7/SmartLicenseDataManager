import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmdbUserMap, ISearchCmdbUserMap } from '../../../services/cmdb/userMap/userMap.model';
import userMapService from '../../../services/cmdb/userMap/userMap.service';

// Asynchronous thunk action

export const searchCmdbUserMap = createAsyncThunk(
  'searchCmdbUserMap',
  async (searchParam?: ISearchCmdbUserMap) => {
    const response = await userMapService.searchCmdbUserMap(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbUserMapById = createAsyncThunk('getCmdbUserMapById', async (id: number) => {
  const response = await userMapService.getCmdbUserMapById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmdbUserMap = createAsyncThunk('saveCmdbUserMap', async (data: ICmdbUserMap) => {
  const response = await userMapService.saveCmdbUserMap(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmdbUserMap = createAsyncThunk('deleteCmdbUserMap', async (id: number) => {
  const response = await userMapService.deleteCmdbUserMap(id).then((res) => {
    return res.body;
  });
  return response;
});
