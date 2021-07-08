import {
  ISearchSqlServerEntitlements,
  ISqlServerEntitlements,
} from '../../../services/sqlServer/sqlServerEntitlements/sqlServerEntitlements.model';
import sqlServerEntitlementsService from '../../../services/sqlServer/sqlServerEntitlements/sqlServerEntitlements.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSqlServerEntitlements = createAsyncThunk(
  'searchSqlServerEntitlements',
  async (searchParam?: ISearchSqlServerEntitlements) => {
    const response = await sqlServerEntitlementsService
      .searchSqlServerEntitlements(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSqlServerEntitlementsById = createAsyncThunk(
  'getSqlServerEntitlementsById',
  async (id: number) => {
    const response = await sqlServerEntitlementsService
      .getSqlServerEntitlementsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSqlServerEntitlements = createAsyncThunk(
  'saveSqlServerEntitlements',
  async (data: ISqlServerEntitlements) => {
    const response = await sqlServerEntitlementsService
      .saveSqlServerEntitlements(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSqlServerEntitlements = createAsyncThunk(
  'deleteSqlServerEntitlements',
  async (id: number) => {
    const response = await sqlServerEntitlementsService
      .deleteSqlServerEntitlements(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
