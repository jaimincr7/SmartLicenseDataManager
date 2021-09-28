import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISpsApiGroup, ISearchSpsApiGroup } from '../../../services/sps/apiGroup/apiGroup.model';
import apiGroupService from '../../../services/sps/apiGroup/apiGroup.service';

// Asynchronous thunk action

export const searchSpsApiGroup = createAsyncThunk(
  'searchSpsApiGroup',
  async (searchParam?: ISearchSpsApiGroup) => {
    const response = await apiGroupService.searchSpsApiGroup(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiGroupById = createAsyncThunk('getSpsApiGroupById', async (id: number) => {
  const response = await apiGroupService.getSpsApiGroupById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApiGroup = createAsyncThunk('saveSpsApiGroup', async (data: ISpsApiGroup) => {
  const response = await apiGroupService.saveSpsApiGroup(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSpsApiGroup = createAsyncThunk('deleteSpsApiGroup', async (id: number) => {
  const response = await apiGroupService.deleteSpsApiGroup(id).then((res) => {
    return res.body;
  });
  return response;
});
