import { ISearchSqlServer, ISqlServer } from '../../services/sqlServer/sqlServer.model';
import sqlServerService from '../../services/sqlServer/sqlServer.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSqlServer = createAsyncThunk(
  'searchSqlServer',
  async (searchParam: ISearchSqlServer) => {
    const response = await sqlServerService.searchSqlServer(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  },
);

export const getSqlServerById = createAsyncThunk('getSqlServerById', async (id: number) => {
  const response = await sqlServerService.getSqlServerById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveSqlServer = createAsyncThunk('saveSqlServer', async (data: ISqlServer) => {
  const response = await sqlServerService.saveSqlServer(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteSqlServer = createAsyncThunk('deleteSqlServer', async (id: number) => {
  const response = await sqlServerService.deleteSqlServer(id).then((res) => {
    return res.body;
  });
  return response;
});
