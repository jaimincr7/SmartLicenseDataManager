import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigLicenseUnits,
  ISearchConfigLicenseUnits,
} from '../../../services/master/licenseUnits/licenseUnits.model';
import licenseUnitsService from '../../../services/master/licenseUnits/licenseUnits.service';

// Asynchronous thunk action

export const searchConfigLicenseUnits = createAsyncThunk(
  'searchConfigLicenseUnits',
  async (searchParam?: ISearchConfigLicenseUnits) => {
    const response = await licenseUnitsService.searchConfigLicenseUnits(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getConfigLicenseUnitsById = createAsyncThunk(
  'getConfigLicenseUnitsById',
  async (id: number) => {
    const response = await licenseUnitsService.getConfigLicenseUnitsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigLicenseUnits = createAsyncThunk(
  'saveConfigLicenseUnits',
  async (data: IConfigLicenseUnits) => {
    const response = await licenseUnitsService.saveConfigLicenseUnits(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigLicenseUnits = createAsyncThunk(
  'deleteConfigLicenseUnits',
  async (id: number) => {
    const response = await licenseUnitsService.deleteConfigLicenseUnits(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
