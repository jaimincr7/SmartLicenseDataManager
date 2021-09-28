import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISpsApiType, ISearchSpsApiType } from '../../../services/sps/apiType/apiType.model';
import apiTypeService from '../../../services/sps/apiType/apiType.service';

// Asynchronous thunk action

export const searchSpsApiType = createAsyncThunk(
  'searchSpsApiType',
  async (searchParam?: ISearchSpsApiType) => {
    const response = await apiTypeService.searchSpsApiType(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiTypeById = createAsyncThunk('getSpsApiTypeById', async (id: number) => {
  const response = await apiTypeService.getSpsApiTypeById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApiType = createAsyncThunk('saveSpsApiType', async (data: ISpsApiType) => {
  const response = await apiTypeService.saveSpsApiType(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSpsApiType = createAsyncThunk('deleteSpsApiType', async (id: number) => {
  const response = await apiTypeService.deleteSpsApiType(id).then((res) => {
    return res.body;
  });
  return response;
});
