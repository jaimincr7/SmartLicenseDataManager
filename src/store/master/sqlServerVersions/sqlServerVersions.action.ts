import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigSqlServerVersions,
  ISearchConfigSqlServerVersions,
} from '../../../services/master/sqlServerVersions/sqlServerVersions.model';
import sqlServerVersionsService from '../../../services/master/sqlServerVersions/sqlServerVersions.service';

// Asynchronous thunk action

export const searchConfigSqlServerVersions = createAsyncThunk(
  'searchConfigSqlServerVersions',
  async (searchParam?: ISearchConfigSqlServerVersions) => {
    const response = await sqlServerVersionsService
      .searchConfigSqlServerVersions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigSqlServerVersionsById = createAsyncThunk(
  'getConfigSqlServerVersionsById',
  async (id: number) => {
    const response = await sqlServerVersionsService
      .getConfigSqlServerVersionsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigSqlServerVersions = createAsyncThunk(
  'saveConfigSqlServerVersions',
  async (data: IConfigSqlServerVersions) => {
    const response = await sqlServerVersionsService
      .saveConfigSqlServerVersions(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigSqlServerVersions = createAsyncThunk(
  'deleteConfigSqlServerVersions',
  async (id: number) => {
    const response = await sqlServerVersionsService
      .deleteConfigSqlServerVersions(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
