import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchTabVLicense,
  ITabVLicense,
} from '../../../services/rvTools/tabVLicense/tabVLicense.model';
import tabVLicenseService from '../../../services/rvTools/tabVLicense/tabVLicense.service';

// Asynchronous thunk action

export const searchTabVLicense = createAsyncThunk(
  'searchTabVLicense',
  async (searchParam?: ISearchTabVLicense) => {
    const response = await tabVLicenseService.searchTabVLicense(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getTabVLicenseById = createAsyncThunk('getTabVLicenseById', async (id: number) => {
  const response = await tabVLicenseService.getTabVLicenseById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveTabVLicense = createAsyncThunk('saveTabVLicense', async (data: ITabVLicense) => {
  const response = await tabVLicenseService.saveTabVLicense(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteTabVLicense = createAsyncThunk('deleteTabVLicense', async (id: number) => {
  const response = await tabVLicenseService.deleteTabVLicense(id).then((res) => {
    return res.body;
  });
  return response;
});
