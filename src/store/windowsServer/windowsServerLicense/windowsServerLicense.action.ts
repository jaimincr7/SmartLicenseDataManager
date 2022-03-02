import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IReRunAllScenarios,
  ISearchWindowsServerLicense,
  IWindowsServerLicense,
} from '../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';
import windowsServerLicenseService from '../../../services/windowsServer/windowsServerLicense/windowsServerLicense.service';

// Asynchronous thunk action

export const searchWindowsServerLicense = createAsyncThunk(
  'searchWindowsServerLicense',
  async (searchParam?: ISearchWindowsServerLicense) => {
    const response = await windowsServerLicenseService
      .searchWindowsServerLicense(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getWindowsServerLicenseById = createAsyncThunk(
  'getWindowsServerLicenseById',
  async (id: number) => {
    const response = await windowsServerLicenseService
      .getWindowsServerLicenseById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveWindowsServerLicense = createAsyncThunk(
  'saveWindowsServerLicense',
  async (data: IWindowsServerLicense) => {
    const response = await windowsServerLicenseService
      .saveWindowsServerLicense(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteWindowsServerLicense = createAsyncThunk(
  'deleteWindowsServerLicense',
  async (id: number) => {
    const response = await windowsServerLicenseService
      .deleteWindowsServerLicense(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const reRunAllScenariosWindows = createAsyncThunk(
  'reRunAllScenariosWindows',
  async (data: IReRunAllScenarios) => {
    const response = await windowsServerLicenseService.reRunAllScenarios(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
