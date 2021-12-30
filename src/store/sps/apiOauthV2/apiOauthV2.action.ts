import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiOauthV2,
  ISearchSpsApiOauthV2,
} from '../../../services/sps/apiOauthV2/apiOauthV2.model';
import apiOauthV2Service from '../../../services/sps/apiOauthV2/apiOauthV2.service';

// Asynchronous thunk action

export const searchSpsApiOauthV2 = createAsyncThunk(
  'searchSpsApiOauthV2',
  async (searchParam?: ISearchSpsApiOauthV2) => {
    const response = await apiOauthV2Service.searchSpsApiOauthV2(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiOauthV2ById = createAsyncThunk('getSpsApiOauthV2ById', async (id: number) => {
  const response = await apiOauthV2Service.getSpsApiOauthV2ById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApiOauthV2 = createAsyncThunk(
  'saveSpsApiOauthV2',
  async (data: ISpsApiOauthV2) => {
    const response = await apiOauthV2Service.saveSpsApiOauthV2(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSpsApiOauthV2 = createAsyncThunk('deleteSpsApiOauthV2', async (id: number) => {
  const response = await apiOauthV2Service.deleteSpsApiOauthV2(id).then((res) => {
    return res.body;
  });
  return response;
});
