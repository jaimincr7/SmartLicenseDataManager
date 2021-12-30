import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiInjectionParamV2,
  ISearchSpsApiInjectionParamV2,
} from '../../../services/sps/apiInjectionParamV2/apiInjectionParamV2.model';
import apiInjectionParamV2Service from '../../../services/sps/apiInjectionParamV2/apiInjectionParamV2.service';

// Asynchronous thunk action

export const searchSpsApiInjectionParamV2 = createAsyncThunk(
  'searchSpsApiInjectionParamV2',
  async (searchParam?: ISearchSpsApiInjectionParamV2) => {
    const response = await apiInjectionParamV2Service
      .searchSpsApiInjectionParamV2(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiInjectionParamV2ById = createAsyncThunk(
  'getSpsApiInjectionParamV2ById',
  async (id: number) => {
    const response = await apiInjectionParamV2Service
      .getSpsApiInjectionParamV2ById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiInjectionParamV2 = createAsyncThunk(
  'getSpsApiInjectionParamV2',
  async (id: number) => {
    const response = await apiInjectionParamV2Service.getSpsApiInjectionParamV2(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSpsApiInjectionParamV2 = createAsyncThunk(
  'saveSpsApiInjectionParamV2',
  async (data: ISpsApiInjectionParamV2) => {
    const response = await apiInjectionParamV2Service
      .saveSpsApiInjectionParamV2(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSpsApiInjectionParamV2 = createAsyncThunk(
  'deleteSpsApiInjectionParamV2',
  async (id: number) => {
    const response = await apiInjectionParamV2Service
      .deleteSpsApiInjectionParamV2(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
