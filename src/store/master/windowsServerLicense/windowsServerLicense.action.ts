import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigWindowsServerLicense,
  ISearchConfigWindowsServerLicense,
} from '../../../services/master/windowsServerLicense/windowsServerLicense.model';
import windowsServerLicenseService from '../../../services/master/windowsServerLicense/windowsServerLicense.service';

// Asynchronous thunk action

export const searchConfigWindowsServerLicense = createAsyncThunk(
  'searchConfigWindowsServerLicense',
  async (searchParam?: ISearchConfigWindowsServerLicense) => {
    const response = await windowsServerLicenseService
      .searchConfigWindowsServerLicense(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigWindowsServerLicenseById = createAsyncThunk(
  'getConfigWindowsServerLicenseById',
  async (id: number) => {
    const response = await windowsServerLicenseService
      .getConfigWindowsServerLicenseById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigWindowsServerLicense = createAsyncThunk(
  'saveConfigWindowsServerLicense',
  async (data: IConfigWindowsServerLicense) => {
    const response = await windowsServerLicenseService
      .saveConfigWindowsServerLicense(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigWindowsServerLicense = createAsyncThunk(
  'deleteConfigWindowsServerLicense',
  async (id: number) => {
    const response = await windowsServerLicenseService
      .deleteConfigWindowsServerLicense(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
