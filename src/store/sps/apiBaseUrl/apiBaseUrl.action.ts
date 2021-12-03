import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiBaseUrl,
  ISearchSpsApiBaseUrl,
} from '../../../services/sps/apiBaseUrl/apiBaseUrl.model';
import apiBaseUrlService from '../../../services/sps/apiBaseUrl/apiBaseUrl.service';

// Asynchronous thunk action

export const searchSpsApiBaseUrl = createAsyncThunk(
  'searchSpsApiBaseUrl',
  async (searchParam?: ISearchSpsApiBaseUrl) => {
    const response = await apiBaseUrlService.searchSpsApiBaseUrl(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiBaseUrlById = createAsyncThunk('getSpsApiBaseUrlById', async (id: number) => {
  const response = await apiBaseUrlService.getSpsApiBaseUrlById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApiBaseUrl = createAsyncThunk(
  'saveSpsApiBaseUrl',
  async (data: ISpsApiBaseUrl) => {
    const response = await apiBaseUrlService.saveSpsApiBaseUrl(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSpsApiBaseUrl = createAsyncThunk('deleteSpsApiBaseUrl', async (id: number) => {
  const response = await apiBaseUrlService.deleteSpsApiBaseUrl(id).then((res) => {
    return res.body;
  });
  return response;
});
