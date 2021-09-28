import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiTokenConfigOptions,
  ISearchSpsApiTokenConfigOptions,
} from '../../../services/sps/apiTokenConfigOptions/apiTokenConfigOptions.model';
import apiTokenConfigOptionsService from '../../../services/sps/apiTokenConfigOptions/apiTokenConfigOptions.service';

// Asynchronous thunk action

export const searchSpsApiTokenConfigOptions = createAsyncThunk(
  'searchSpsApiTokenConfigOptions',
  async (searchParam?: ISearchSpsApiTokenConfigOptions) => {
    const response = await apiTokenConfigOptionsService
      .searchSpsApiTokenConfigOptions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiTokenConfigOptionsById = createAsyncThunk(
  'getSpsApiTokenConfigOptionsById',
  async (id: number) => {
    const response = await apiTokenConfigOptionsService
      .getSpsApiTokenConfigOptionsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSpsApiTokenConfigOptions = createAsyncThunk(
  'saveSpsApiTokenConfigOptions',
  async (data: ISpsApiTokenConfigOptions) => {
    const response = await apiTokenConfigOptionsService
      .saveSpsApiTokenConfigOptions(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSpsApiTokenConfigOptions = createAsyncThunk(
  'deleteSpsApiTokenConfigOptions',
  async (id: number) => {
    const response = await apiTokenConfigOptionsService
      .deleteSpsApiTokenConfigOptions(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
