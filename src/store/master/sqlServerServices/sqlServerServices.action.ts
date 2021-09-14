import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigSqlServerServices,
  ISearchConfigSqlServerServices,
} from '../../../services/master/sqlServerServices/sqlServerServices.model';
import sqlServerServicesService from '../../../services/master/sqlServerServices/sqlServerServices.service';

// Asynchronous thunk action

export const searchConfigSqlServerServices = createAsyncThunk(
  'searchConfigSqlServerServices',
  async (searchParam?: ISearchConfigSqlServerServices) => {
    const response = await sqlServerServicesService
      .searchConfigSqlServerServices(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigSqlServerServicesById = createAsyncThunk(
  'getConfigSqlServerServicesById',
  async (id: number) => {
    const response = await sqlServerServicesService
      .getConfigSqlServerServicesById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigSqlServerServices = createAsyncThunk(
  'saveConfigSqlServerServices',
  async (data: IConfigSqlServerServices) => {
    const response = await sqlServerServicesService
      .saveConfigSqlServerServices(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigSqlServerServices = createAsyncThunk(
  'deleteConfigSqlServerServices',
  async (id: number) => {
    const response = await sqlServerServicesService
      .deleteConfigSqlServerServices(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
