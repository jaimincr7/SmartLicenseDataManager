import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigSqlServerLicense,
  ISearchConfigSqlServerLicense,
} from '../../../services/master/sqlServerLicense/sqlServerLicense.model';
import sqlServerLicenseService from '../../../services/master/sqlServerLicense/sqlServerLicense.service';

// Asynchronous thunk action

export const searchConfigSqlServerLicense = createAsyncThunk(
  'searchConfigSqlServerLicense',
  async (searchParam?: ISearchConfigSqlServerLicense) => {
    const response = await sqlServerLicenseService
      .searchConfigSqlServerLicense(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigSqlServerLicenseById = createAsyncThunk(
  'getConfigSqlServerLicenseById',
  async (id: number) => {
    const response = await sqlServerLicenseService.getConfigSqlServerLicenseById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigSqlServerLicense = createAsyncThunk(
  'saveConfigSqlServerLicense',
  async (data: IConfigSqlServerLicense) => {
    const response = await sqlServerLicenseService.saveConfigSqlServerLicense(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigSqlServerLicense = createAsyncThunk(
  'deleteConfigSqlServerLicense',
  async (id: number) => {
    const response = await sqlServerLicenseService.deleteConfigSqlServerLicense(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
