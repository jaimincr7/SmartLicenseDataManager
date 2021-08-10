import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfiguration,
  ISearchConfiguration,
} from '../../../services/powerBiReports/configuration/configuration.model';
import configurationService from '../../../services/powerBiReports/configuration/configuration.service';

// Asynchronous thunk action

export const searchConfiguration = createAsyncThunk(
  'searchConfiguration',
  async (searchParam?: ISearchConfiguration) => {
    const response = await configurationService.searchConfiguration(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigurationById = createAsyncThunk('getConfigurationById', async (id: number) => {
  const response = await configurationService.getConfigurationById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveConfiguration = createAsyncThunk(
  'saveConfiguration',
  async (data: IConfiguration) => {
    const response = await configurationService.saveConfiguration(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfiguration = createAsyncThunk('deleteConfiguration', async (id: number) => {
  const response = await configurationService.deleteConfiguration(id).then((res) => {
    return res.body;
  });
  return response;
});

export const getGroups = createAsyncThunk('getGroups', async () => {
  const response = await configurationService.getGroups().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getReportsByGroupId = createAsyncThunk('getReportsByGroupId', async (id: string) => {
  const response = await configurationService.getReportsByGroupId(id).then((res) => {
    return res.body;
  });
  return response.data;
});
