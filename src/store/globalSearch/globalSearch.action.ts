import { createAsyncThunk } from '@reduxjs/toolkit';
import commonService from '../../services/common/common.service';

// Asynchronous thunk action

export const getGlobalTenantLookup = createAsyncThunk('getGlobalTenantLookup', async () => {
  const response = await commonService.getTenantLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getGlobalCompanyLookup = createAsyncThunk(
  'getGlobalCompanyLookup',
  async (tenantId: number) => {
    const response = await commonService.getCompanyLookup(tenantId).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getGlobalBULookup = createAsyncThunk(
  'getGlobalBULookup',
  async (companyId: number) => {
    const response = await commonService.getBULookup(companyId).then((res) => {
      return res.body;
    });
    return response.data;
  }
);
