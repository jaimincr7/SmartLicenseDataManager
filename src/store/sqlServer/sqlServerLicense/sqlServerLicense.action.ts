import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IReRunAllScenarios,
  ISearchSqlServerLicense,
  ISqlServerLicense,
} from '../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';
import sqlServerLicenseService from '../../../services/sqlServer/sqlServerLicense/sqlServerLicense.service';

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

export const reRunAllScenarios = createAsyncThunk(
  'reRunAllScenarios',
  async (data: IReRunAllScenarios) => {
    const response = await sqlServerLicenseService.reRunAllScenarios(data).then((res) => {
      return res.body;
    });
    return response;
  }
);
