import { ISearchSoftware, ISoftware } from '../../../services/inventory/software/software.model';
import inventoryService from '../../../services/inventory/software/software.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSoftware = createAsyncThunk(
  'searchSoftware',
  async (searchParam?: ISearchSoftware) => {
    const response = await inventoryService.searchSoftware(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSoftwareById = createAsyncThunk('getSoftwareById', async (id: number) => {
  const response = await inventoryService.getSoftwareById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSoftware = createAsyncThunk('saveSoftware', async (data: ISoftware) => {
  const response = await inventoryService.saveSoftware(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSoftware = createAsyncThunk('deleteSoftware', async (id: number) => {
  const response = await inventoryService.deleteSoftware(id).then((res) => {
    return res.body;
  });
  return response;
});
