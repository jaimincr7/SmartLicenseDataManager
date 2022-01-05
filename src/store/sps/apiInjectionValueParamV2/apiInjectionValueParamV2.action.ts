import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchSpsApiInjectionValueParamV2 } from '../../../services/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.model';
import apiInjectionValueParamV2Service from '../../../services/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.service';

// Asynchronous thunk action

export const searchSpsApiInjectionValueParamV2 = createAsyncThunk(
  'searchSpsApiInjectionValueParamV2',
  async (searchParam?: ISearchSpsApiInjectionValueParamV2) => {
    const response = await apiInjectionValueParamV2Service
      .searchSpsApiInjectionValueParamV2(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiInjectionValueParamV2ById = createAsyncThunk(
  'getSpsApiInjectionValueParamV2ById',
  async (id: number) => {
    const response = await apiInjectionValueParamV2Service
      .getSpsApiInjectionValueParamV2ById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiInjectionValueV2ByOauthId = createAsyncThunk(
  'getSpsApiInjectionValueV2ByOauthId',
  async (id: number) => {
    const response = await apiInjectionValueParamV2Service
      .getSpsApiInjectionValueV2ByOauthId(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSpsApiInjectionValueParamV2 = createAsyncThunk(
  'saveSpsApiInjectionValueParamV2',
  async (data: any) => {
    const response = await apiInjectionValueParamV2Service
      .saveSpsApiInjectionValueParamV2(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSpsApiInjectionValueParamV2 = createAsyncThunk(
  'deleteSpsApiInjectionValueParamV2',
  async (id: number) => {
    const response = await apiInjectionValueParamV2Service
      .deleteSpsApiInjectionValueParamV2(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
