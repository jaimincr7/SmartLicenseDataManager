import {
  IProcessData,
  ISearchSqlServerInventory,
  ISqlServerInventory,
} from '../../services/sqlServerInventory/sqlServerInventory.model';
import sqlServerService from '../../services/sqlServerInventory/sqlServerInventory.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSqlServerInventory = createAsyncThunk(
  'searchSqlServerInventory',
  async (searchParam?: ISearchSqlServerInventory) => {
    const response = await sqlServerService.searchSqlServerInventory(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getSqlServerInventoryById = createAsyncThunk(
  'getSqlServerInventoryById',
  async (id: number) => {
    const response = await sqlServerService.getSqlServerInventoryById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSqlServerInventory = createAsyncThunk(
  'saveSqlServerInventory',
  async (data: ISqlServerInventory) => {
    const response = await sqlServerService.saveSqlServerInventory(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSqlServerInventory = createAsyncThunk(
  'deleteSqlServerInventory',
  async (id: number) => {
    const response = await sqlServerService.deleteSqlServerInventory(id).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const processData = createAsyncThunk('processData', async (data: IProcessData) => {
  const response = await sqlServerService.processData(data).then((res) => {
    return res.body;
  });
  return response;
});
