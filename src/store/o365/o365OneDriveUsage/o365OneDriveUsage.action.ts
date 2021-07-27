import {
  ISearchO365OneDriveUsage,
  IO365OneDriveUsage,
} from '../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.model';
import o365OneDriveUsageService from '../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchO365OneDriveUsage = createAsyncThunk(
  'searchO365OneDriveUsage',
  async (searchParam?: ISearchO365OneDriveUsage) => {
    const response = await o365OneDriveUsageService
      .searchO365OneDriveUsage(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getO365OneDriveUsageById = createAsyncThunk(
  'getO365OneDriveUsageById',
  async (id: number) => {
    const response = await o365OneDriveUsageService.getO365OneDriveUsageById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveO365OneDriveUsage = createAsyncThunk(
  'saveO365OneDriveUsage',
  async (data: IO365OneDriveUsage) => {
    const response = await o365OneDriveUsageService.saveO365OneDriveUsage(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteO365OneDriveUsage = createAsyncThunk(
  'deleteO365OneDriveUsage',
  async (id: number) => {
    const response = await o365OneDriveUsageService.deleteO365OneDriveUsage(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
