import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchWindowsServerOverrides,
  IWindowsServerOverrides,
} from '../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';
import windowsServerOverridesService from '../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.service';

// Asynchronous thunk action

export const searchWindowsServerOverrides = createAsyncThunk(
  'searchWindowsServerOverrides',
  async (searchParam?: ISearchWindowsServerOverrides) => {
    const response = await windowsServerOverridesService
      .searchWindowsServerOverrides(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getWindowsServerOverridesById = createAsyncThunk(
  'getWindowsServerOverridesById',
  async (id: number) => {
    const response = await windowsServerOverridesService
      .getWindowsServerOverridesById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveWindowsServerOverrides = createAsyncThunk(
  'saveWindowsServerOverrides',
  async (data: IWindowsServerOverrides) => {
    const response = await windowsServerOverridesService
      .saveWindowsServerOverrides(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteWindowsServerOverrides = createAsyncThunk(
  'deleteWindowsServerOverrides',
  async (id: number) => {
    const response = await windowsServerOverridesService
      .deleteWindowsServerOverrides(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
