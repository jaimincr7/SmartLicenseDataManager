import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchWindowsServerEntitlements,
  IWindowsServerEntitlements,
} from '../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.model';
import windowsServerEntitlementsService from '../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.service';

// Asynchronous thunk action

export const searchWindowsServerEntitlements = createAsyncThunk(
  'searchWindowsServerEntitlements',
  async (searchParam?: ISearchWindowsServerEntitlements) => {
    const response = await windowsServerEntitlementsService
      .searchWindowsServerEntitlements(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getWindowsServerEntitlementsById = createAsyncThunk(
  'getWindowsServerEntitlementsById',
  async (id: number) => {
    const response = await windowsServerEntitlementsService
      .getWindowsServerEntitlementsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveWindowsServerEntitlements = createAsyncThunk(
  'saveWindowsServerEntitlements',
  async (data: IWindowsServerEntitlements) => {
    const response = await windowsServerEntitlementsService
      .saveWindowsServerEntitlements(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteWindowsServerEntitlements = createAsyncThunk(
  'deleteWindowsServerEntitlements',
  async (id: number) => {
    const response = await windowsServerEntitlementsService
      .deleteWindowsServerEntitlements(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
