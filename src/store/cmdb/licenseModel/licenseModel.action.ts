import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbLicenseModel,
  ISearchCmdbLicenseModel,
} from '../../../services/cmdb/licenseModel/licenseModel.model';
import licenseModelService from '../../../services/cmdb/licenseModel/licenseModel.service';

// Asynchronous thunk action

export const searchCmdbLicenseModel = createAsyncThunk(
  'searchCmdbLicenseModel',
  async (searchParam?: ISearchCmdbLicenseModel) => {
    const response = await licenseModelService.searchCmdbLicenseModel(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbLicenseModelById = createAsyncThunk(
  'getCmdbLicenseModelById',
  async (id: number) => {
    const response = await licenseModelService.getCmdbLicenseModelById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmdbLicenseModel = createAsyncThunk(
  'saveCmdbLicenseModel',
  async (data: ICmdbLicenseModel) => {
    const response = await licenseModelService.saveCmdbLicenseModel(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbLicenseModel = createAsyncThunk(
  'deleteCmdbLicenseModel',
  async (id: number) => {
    const response = await licenseModelService.deleteCmdbLicenseModel(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
