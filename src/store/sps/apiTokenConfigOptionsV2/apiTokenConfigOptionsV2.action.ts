import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiTokenConfigOptionsV2,
  ISearchSpsApiTokenConfigOptionsV2,
} from '../../../services/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.model';
import apiTokenConfigOptionsV2Service from '../../../services/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.service';

// Asynchronous thunk action

export const searchSpsApiTokenConfigOptionsV2 = createAsyncThunk(
  'searchSpsApiTokenConfigOptionsV2',
  async (searchParam?: ISearchSpsApiTokenConfigOptionsV2) => {
    const response = await apiTokenConfigOptionsV2Service
      .searchSpsApiTokenConfigOptionsV2(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiTokenConfigOptionsV2ById = createAsyncThunk(
  'getSpsApiTokenConfigOptionsV2ById',
  async (id: number) => {
    const response = await apiTokenConfigOptionsV2Service
      .getSpsApiTokenConfigOptionsV2ById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSpsApiTokenConfigOptionsV2 = createAsyncThunk(
  'saveSpsApiTokenConfigOptionsV2',
  async (data: ISpsApiTokenConfigOptionsV2) => {
    const response = await apiTokenConfigOptionsV2Service
      .saveSpsApiTokenConfigOptionsV2(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSpsApiTokenConfigOptionsV2 = createAsyncThunk(
  'deleteSpsApiTokenConfigOptionsV2',
  async (id: number) => {
    const response = await apiTokenConfigOptionsV2Service
      .deleteSpsApiTokenConfigOptionsV2(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
