import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbApplication,
  ISearchCmdbApplication,
} from '../../../services/cmdb/application/application.model';
import applicationService from '../../../services/cmdb/application/application.service';

// Asynchronous thunk action

export const searchCmdbApplication = createAsyncThunk(
  'searchCmdbApplication',
  async (searchParam?: ISearchCmdbApplication) => {
    const response = await applicationService.searchCmdbApplication(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbApplicationById = createAsyncThunk(
  'getCmdbApplicationById',
  async (id: number) => {
    const response = await applicationService.getCmdbApplicationById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmdbApplication = createAsyncThunk(
  'saveCmdbApplication',
  async (data: ICmdbApplication) => {
    const response = await applicationService.saveCmdbApplication(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbApplication = createAsyncThunk(
  'deleteCmdbApplication',
  async (id: number) => {
    const response = await applicationService.deleteCmdbApplication(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
