import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISaveApiColumnMapping,
  ISearchAPIColMapping,
  ISearchAPIColumn,
} from '../../../services/sps/apiColumnMapping/apiColMapping.model';
import apiColMappingService from '../../../services/sps/apiColumnMapping/apiColMapping.service';

// Asynchronous thunk action

export const searchApiColMapping = createAsyncThunk(
  'searchApiColMapping',
  async (searchParam?: ISearchAPIColMapping) => {
    const response = await apiColMappingService.searchApiColMapping(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getApiColMappingById = createAsyncThunk('getApiColMappingById', async (id: number) => {
  const response = await apiColMappingService.getApiColMappingById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveApiColMapping = createAsyncThunk(
  'saveApiColMapping',
  async (data: ISaveApiColumnMapping) => {
    const response = await apiColMappingService.saveApiColMapping(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteApiColMapping = createAsyncThunk('deleteApiColMapping', async (id: number) => {
  const response = await apiColMappingService.deleteApiColMapping(id).then((res) => {
    return res.body;
  });
  return response;
});

export const apiColLookups = createAsyncThunk('apiColLookups', async () => {
  const response = await apiColMappingService.apiColLookups().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getApiColumn = createAsyncThunk(
  'getApiColumn',
  async (searchData: ISearchAPIColumn) => {
    const response = await apiColMappingService.getApiColumn(searchData).then((res) => {
      return res.body;
    });
    return response.data;
  }
);
