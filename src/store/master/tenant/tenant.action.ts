import { ITenant, ISearchTenant } from './../../../services/master/tenant/tenant.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import tenantService from '../../../services/master/tenant/tenant.service';

// Asynchronous thunk action

export const searchTenant = createAsyncThunk(
  'searchTenant',
  async (searchParam?: ISearchTenant) => {
    const response = await tenantService.searchTenant(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getTenantById = createAsyncThunk('getTenantById', async (id: number) => {
  const response = await tenantService.getTenantById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveTenant = createAsyncThunk('saveTenant', async (data: ITenant) => {
  const response = await tenantService.saveTenant(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteTenant = createAsyncThunk('deleteTenant', async (id: number) => {
  const response = await tenantService.deleteTenant(id).then((res) => {
    return res.body;
  });
  return response;
});
