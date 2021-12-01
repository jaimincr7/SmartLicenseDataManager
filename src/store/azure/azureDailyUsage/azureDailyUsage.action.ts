import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchAzureDailyUsage,
  IAzureDailyUsage,
  IProcessData,
} from '../../../services/azure/azureDailyUsage/azureDailyUsage.model';
import azureDailyUsageService from '../../../services/azure/azureDailyUsage/azureDailyUsage.service';

// Asynchronous thunk action

export const searchAzureDailyUsage = createAsyncThunk(
  'searchAzureDailyUsage',
  async (searchParam?: ISearchAzureDailyUsage) => {
    const response = await azureDailyUsageService.searchAzureDailyUsage(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAzureDailyUsageById = createAsyncThunk(
  'getAzureDailyUsageById',
  async (id: number) => {
    const response = await azureDailyUsageService.getAzureDailyUsageById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveAzureDailyUsage = createAsyncThunk(
  'saveAzureDailyUsage',
  async (data: IAzureDailyUsage) => {
    const response = await azureDailyUsageService.saveAzureDailyUsage(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteAzureDailyUsage = createAsyncThunk(
  'deleteAzureDailyUsage',
  async (id: number) => {
    const response = await azureDailyUsageService.deleteAzureDailyUsage(id).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const processDataAzure = createAsyncThunk('processDataAzure', async (data: IProcessData) => {
  const response = await azureDailyUsageService.processData(data).then((res) => {
    return res.body;
  });
  return response;
});
