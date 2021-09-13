import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigSupportTypes,
  ISearchConfigSupportTypes,
} from '../../../services/master/supportTypes/supportTypes.model';
import supportTypesService from '../../../services/master/supportTypes/supportTypes.service';

// Asynchronous thunk action

export const searchConfigSupportTypes = createAsyncThunk(
  'searchConfigSupportTypes',
  async (searchParam?: ISearchConfigSupportTypes) => {
    const response = await supportTypesService.searchConfigSupportTypes(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigSupportTypesById = createAsyncThunk(
  'getConfigSupportTypesById',
  async (id: number) => {
    const response = await supportTypesService.getConfigSupportTypesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigSupportTypes = createAsyncThunk(
  'saveConfigSupportTypes',
  async (data: IConfigSupportTypes) => {
    const response = await supportTypesService.saveConfigSupportTypes(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigSupportTypes = createAsyncThunk(
  'deleteConfigSupportTypes',
  async (id: number) => {
    const response = await supportTypesService.deleteConfigSupportTypes(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
