import { createAsyncThunk } from '@reduxjs/toolkit';
import adDevicesService from '../../../services/ad/adDevices/adDevices.service';
import {
  ISearchAdDevices,
  IAdDevices,
  IProcessData,
} from '../../../services/ad/adDevices/adDevices.model';

// Asynchronous thunk action

export const searchAdDevices = createAsyncThunk(
  'searchAdDevices',
  async (searchParam?: ISearchAdDevices) => {
    const response = await adDevicesService.searchAdDevices(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAdDeviceById = createAsyncThunk('getAdDeviceById', async (id: number) => {
  const response = await adDevicesService.getAdDeviceById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveAdDevice = createAsyncThunk('saveAdDevice', async (data: IAdDevices) => {
  const response = await adDevicesService.saveAdDevice(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteAdDevice = createAsyncThunk('deleteAdDevice', async (id: number) => {
  const response = await adDevicesService.deleteAdDevice(id).then((res) => {
    return res.body;
  });
  return response;
});

export const processDataAdDevice = createAsyncThunk(
  'processDataAdDevice',
  async (data: IProcessData) => {
    const response = await adDevicesService.processData(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
