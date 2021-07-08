import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchSqlServerPricing,
  ISqlServerPricing,
} from '../../../services/sqlServer/sqlServerPricing/sqlServerPricing.model';
import sqlServerPricingService from '../../../services/sqlServer/sqlServerPricing/sqlServerPricing.service';

// Asynchronous thunk action

export const searchSqlServerPricing = createAsyncThunk(
  'searchSqlServerPricing',
  async (searchParam?: ISearchSqlServerPricing) => {
    const response = await sqlServerPricingService
      .searchSqlServerPricing(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSqlServerPricingById = createAsyncThunk(
  'getSqlServerPricingById',
  async (id: number) => {
    const response = await sqlServerPricingService.getSqlServerPricingById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSqlServerPricing = createAsyncThunk(
  'saveSqlServerPricing',
  async (data: ISqlServerPricing) => {
    const response = await sqlServerPricingService.saveSqlServerPricing(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSqlServerPricing = createAsyncThunk(
  'deleteSqlServerPricing',
  async (id: number) => {
    const response = await sqlServerPricingService.deleteSqlServerPricing(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
