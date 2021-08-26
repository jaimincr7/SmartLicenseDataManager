import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmdbDevice, ISearchCmdbDevice } from '../../../services/cmdb/device/device.model';
import deviceService from '../../../services/cmdb/device/device.service';

// Asynchronous thunk action

export const searchCmdbDevice = createAsyncThunk(
  'searchCmdbDevice',
  async (searchParam?: ISearchCmdbDevice) => {
    const response = await deviceService.searchCmdbDevice(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbDeviceById = createAsyncThunk('getCmdbDeviceById', async (id: number) => {
  const response = await deviceService.getCmdbDeviceById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmdbDevice = createAsyncThunk('saveCmdbDevice', async (data: ICmdbDevice) => {
  const response = await deviceService.saveCmdbDevice(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmdbDevice = createAsyncThunk('deleteCmdbDevice', async (id: number) => {
  const response = await deviceService.deleteCmdbDevice(id).then((res) => {
    return res.body;
  });
  return response;
});
