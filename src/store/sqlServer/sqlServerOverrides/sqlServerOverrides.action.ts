import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchSqlServerOverrides,
  ISqlServerOverrides,
} from '../../../services/sqlServer/sqlServerOverrides/sqlServerOverrides.model';
import sqlServerOverridesService from '../../../services/sqlServer/sqlServerOverrides/sqlServerOverrides.service';

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
