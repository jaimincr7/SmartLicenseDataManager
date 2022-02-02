import {
  ISearchHardware,
  IHardware,
  IProcessData,
} from '../../../services/inventory/hardware/hardware.model';
import inventoryService from '../../../services/inventory/hardware/hardware.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchHardware = createAsyncThunk(
  'searchHardware',
  async (searchParam?: ISearchHardware) => {
    const response = await inventoryService.searchHardware(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getHardwareById = createAsyncThunk('getHardwareById', async (id: number) => {
  const response = await inventoryService.getHardwareById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveHardware = createAsyncThunk('saveHardware', async (data: IHardware) => {
  const response = await inventoryService.saveHardware(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteHardware = createAsyncThunk('deleteHardware', async (id: number) => {
  const response = await inventoryService.deleteHardware(id).then((res) => {
    return res.body;
  });
  return response;
});

export const processDataHardware = createAsyncThunk(
  'processDataHardware',
  async (data: IProcessData) => {
    const response = await inventoryService.processData(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
