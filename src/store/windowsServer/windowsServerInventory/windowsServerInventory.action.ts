import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchWindowsServerInventory,
  IWindowsServerInventory,
} from '../../../services/windowsServer/windowsServerInventory/windowsServerInventory.model';
import windowsServerInventoryService from '../../../services/windowsServer/windowsServerInventory/windowsServerInventory.service';

// Asynchronous thunk action

export const searchWindowsServerInventory = createAsyncThunk(
  'searchWindowsServerInventory',
  async (searchParam?: ISearchWindowsServerInventory) => {
    const response = await windowsServerInventoryService
      .searchWindowsServerInventory(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getWindowsServerInventoryById = createAsyncThunk(
  'getWindowsServerInventoryById',
  async (id: number) => {
    const response = await windowsServerInventoryService
      .getWindowsServerInventoryById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveWindowsServerInventory = createAsyncThunk(
  'saveWindowsServerInventory',
  async (data: IWindowsServerInventory) => {
    const response = await windowsServerInventoryService
      .saveWindowsServerInventory(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteWindowsServerInventory = createAsyncThunk(
  'deleteWindowsServerInventory',
  async (id: number) => {
    const response = await windowsServerInventoryService
      .deleteWindowsServerInventory(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);