import { createAsyncThunk } from '@reduxjs/toolkit';
import { IDeleteDataset } from '../../services/common/common.model';
import commonService from '../../services/common/common.service';

// Asynchronous thunk action

export const getTenantLookup = createAsyncThunk('getTenantLookup', async () => {
  const response = await commonService.getTenantLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCompanyLookup = createAsyncThunk('getCompanyLookup', async (tenantId: number) => {
  const response = await commonService.getCompanyLookup(tenantId).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getBULookup = createAsyncThunk('getBULookup', async (companyId: number) => {
  const response = await commonService.getBULookup(companyId).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getSqlServerLicenseLookup = createAsyncThunk('getSqlServerLicenseLookup', async () => {
  const response = await commonService.getSqlServerLicenseLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getAgreementTypesLookup = createAsyncThunk('getAgreementTypesLookup', async () => {
  const response = await commonService.getAgreementTypesLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getCurrencyLookup = createAsyncThunk('getCurrencyLookup', async () => {
  const response = await commonService.getCurrencyLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

export const getWindowsServerLicenseLookup = createAsyncThunk(
  'getWindowsServerLicenseLookup',
  async () => {
    const response = await commonService.getWindowsServerLicenseLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const deleteDataset = createAsyncThunk('deleteDataset', async (data: IDeleteDataset) => {
  const response = await commonService.deleteDataset(data).then((res) => {
    return res.body;
  });
  return response;
});
