import {
  IProcessData,
  ISearchDevice,
  IDevice,
} from '../../../services/inventory/device/device.model';
import inventoryService from '../../../services/inventory/device/device.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchDevice = createAsyncThunk(
  'searchDevice',
  async (searchParam?: ISearchDevice) => {
    const response = await inventoryService.searchDevice(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getDeviceById = createAsyncThunk('getDeviceById', async (id: number) => {
  const response = await inventoryService.getDeviceById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveDevice = createAsyncThunk('saveDevice', async (data: IDevice) => {
  const response = await inventoryService.saveDevice(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteDevice = createAsyncThunk('deleteDevice', async (id: number) => {
  const response = await inventoryService.deleteDevice(id).then((res) => {
    return res.body;
  });
  return response;
});

export const processDataDevice = createAsyncThunk(
  'processDataDevice',
  async (data: IProcessData) => {
    const response = await inventoryService.processData(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
