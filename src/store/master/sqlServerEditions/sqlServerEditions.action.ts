import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigSqlServerEditions,
  ISearchConfigSqlServerEditions,
} from '../../../services/master/sqlServerEditions/sqlServerEditions.model';
import sqlServerEditionsService from '../../../services/master/sqlServerEditions/sqlServerEditions.service';

// Asynchronous thunk action

export const searchConfigSqlServerEditions = createAsyncThunk(
  'searchConfigSqlServerEditions',
  async (searchParam?: ISearchConfigSqlServerEditions) => {
    const response = await sqlServerEditionsService
      .searchConfigSqlServerEditions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigSqlServerEditionsById = createAsyncThunk(
  'getConfigSqlServerEditionsById',
  async (id: number) => {
    const response = await sqlServerEditionsService
      .getConfigSqlServerEditionsById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigSqlServerEditions = createAsyncThunk(
  'saveConfigSqlServerEditions',
  async (data: IConfigSqlServerEditions) => {
    const response = await sqlServerEditionsService
      .saveConfigSqlServerEditions(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigSqlServerEditions = createAsyncThunk(
  'deleteConfigSqlServerEditions',
  async (id: number) => {
    const response = await sqlServerEditionsService
      .deleteConfigSqlServerEditions(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
