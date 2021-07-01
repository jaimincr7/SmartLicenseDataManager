import { createAsyncThunk } from '@reduxjs/toolkit';
import adDevicesService from '../../services/adDevices/adDevices.service';
import {
  ISearchAdDevices,
  IAdDevices,
  IDeleteDataset,
  IProcessData,
  IBulkInsertDataset,
} from './../../services/adDevices/adDevices.model';

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

export const deleteDataset = createAsyncThunk('deleteDataset', async (data: IDeleteDataset) => {
  const response = await adDevicesService.deleteDataset(data).then((res) => {
    return res.body;
  });
  return response;
});

export const processData = createAsyncThunk('processData', async (data: IProcessData) => {
  const response = await adDevicesService.processData(data).then((res) => {
    return res.body;
  });
  return response;
});

export const getExcelColumns = createAsyncThunk('getExcelColumns', async (data: any) => {
  const response = await adDevicesService.getExcelColumns(data).then((res) => {
    return res.body;
  });
  return response.data;
});

export const bulkInsert = createAsyncThunk('bulkInsert', async (data: IBulkInsertDataset) => {
  const response = await adDevicesService.bulkInsert(data).then((res) => {
    return res.body;
  });
  return response;
});
