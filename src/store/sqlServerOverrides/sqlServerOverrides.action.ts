import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IProcessData,
  ISearchSqlServerOverrides,
  ISqlServerOverrides,
} from '../../services/sqlServerOverrides/sqlServerOverrides.model';
import sqlServerOverridesService from '../../services/sqlServerOverrides/sqlServerOverrides.service';

// Asynchronous thunk action

export const searchSqlServerOverrides = createAsyncThunk(
  'searchSqlServerOverrides',
  async (searchParam?: ISearchSqlServerOverrides) => {
    const response = await sqlServerOverridesService
      .searchSqlServerOverrides(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSqlServerOverridesById = createAsyncThunk(
  'getSqlServerOverridesById',
  async (id: number) => {
    const response = await sqlServerOverridesService.getSqlServerOverridesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSqlServerOverrides = createAsyncThunk(
  'saveSqlServerOverrides',
  async (data: ISqlServerOverrides) => {
    const response = await sqlServerOverridesService.saveSqlServerOverrides(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSqlServerOverrides = createAsyncThunk(
  'deleteSqlServerOverrides',
  async (id: number) => {
    const response = await sqlServerOverridesService.deleteSqlServerOverrides(id).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const processData = createAsyncThunk('processData', async (data: IProcessData) => {
  const response = await sqlServerOverridesService.processData(data).then((res) => {
    return res.body;
  });
  return response;
});