import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISpsApiOauth, ISearchSpsApiOauth } from '../../../services/sps/apiOauth/apiOauth.model';
import apiOauthService from '../../../services/sps/apiOauth/apiOauth.service';

// Asynchronous thunk action

export const searchSpsApiOauth = createAsyncThunk(
  'searchSpsApiOauth',
  async (searchParam?: ISearchSpsApiOauth) => {
    const response = await apiOauthService.searchSpsApiOauth(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSpsApiOauthById = createAsyncThunk('getSpsApiOauthById', async (id: number) => {
  const response = await apiOauthService.getSpsApiOauthById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSpsApiOauth = createAsyncThunk('saveSpsApiOauth', async (data: ISpsApiOauth) => {
  const response = await apiOauthService.saveSpsApiOauth(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSpsApiOauth = createAsyncThunk('deleteSpsApiOauth', async (id: number) => {
  const response = await apiOauthService.deleteSpsApiOauth(id).then((res) => {
    return res.body;
  });
  return response;
});
