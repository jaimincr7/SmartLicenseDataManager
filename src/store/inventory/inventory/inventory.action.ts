import {
  IProcessData,
  ISearchInventory,
  IInventory,
} from '../../../services/inventory/inventory/inventory.model';
import inventoryService from '../../../services/inventory/inventory/inventory.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchInventory = createAsyncThunk(
  'searchInventory',
  async (searchParam?: ISearchInventory) => {
    const response = await inventoryService.searchInventory(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getInventoryById = createAsyncThunk('getInventoryById', async (id: number) => {
  const response = await inventoryService.getInventoryById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveInventory = createAsyncThunk('saveInventory', async (data: IInventory) => {
  const response = await inventoryService.saveInventory(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteInventory = createAsyncThunk('deleteInventory', async (id: number) => {
  const response = await inventoryService.deleteInventory(id).then((res) => {
    return res.body;
  });
  return response;
});

export const processDataInventory = createAsyncThunk(
  'processDataInventory',
  async (data: IProcessData) => {
    const response = await inventoryService.processData(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
