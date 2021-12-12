import {
  IProcessData,
  ISearchDeviceState,
  IDeviceState,
} from '../../../services/inventory/deviceState/deviceState.model';
import inventoryService from '../../../services/inventory/deviceState/deviceState.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchDeviceState = createAsyncThunk(
  'searchDeviceState',
  async (searchParam?: ISearchDeviceState) => {
    const response = await inventoryService.searchDeviceState(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getDeviceStateById = createAsyncThunk('getDeviceStateById', async (id: number) => {
  const response = await inventoryService.getDeviceStateById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveDeviceState = createAsyncThunk('saveDeviceState', async (data: IDeviceState) => {
  const response = await inventoryService.saveDeviceState(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteDeviceState = createAsyncThunk('deleteDeviceState', async (id: number) => {
  const response = await inventoryService.deleteDeviceState(id).then((res) => {
    return res.body;
  });
  return response;
});

export const processDataDeviceState = createAsyncThunk(
  'processDataDeviceState',
  async (data: IProcessData) => {
    const response = await inventoryService.processData(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
