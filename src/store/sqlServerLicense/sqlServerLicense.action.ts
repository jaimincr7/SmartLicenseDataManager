import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchSqlServerLicense,
  ISqlServerLicense,
} from '../../services/sqlServerLicense/sqlServerLicense.model';
import sqlServerLicenseService from '../../services/sqlServerLicense/sqlServerLicense.service';

// Asynchronous thunk action

export const searchSqlServerLicense = createAsyncThunk(
  'searchSqlServerLicense',
  async (searchParam?: ISearchSqlServerLicense) => {
    const response = await sqlServerLicenseService
      .searchSqlServerLicense(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSqlServerLicenseById = createAsyncThunk(
  'getSqlServerLicenseById',
  async (id: number) => {
    const response = await sqlServerLicenseService.getSqlServerLicenseById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSqlServerLicense = createAsyncThunk(
  'saveSqlServerLicense',
  async (data: ISqlServerLicense) => {
    const response = await sqlServerLicenseService.saveSqlServerLicense(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSqlServerLicense = createAsyncThunk(
  'deleteSqlServerLicense',
  async (id: number) => {
    const response = await sqlServerLicenseService.deleteSqlServerLicense(id).then((res) => {
      return res.body;
    });
    return response;
  }
);