import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbOperatingSystem,
  ISearchCmdbOperatingSystem,
} from '../../../services/cmdb/operatingSystem/operatingSystem.model';
import operatingSystemService from '../../../services/cmdb/operatingSystem/operatingSystem.service';

// Asynchronous thunk action

export const searchCmdbOperatingSystem = createAsyncThunk(
  'searchCmdbOperatingSystem',
  async (searchParam?: ISearchCmdbOperatingSystem) => {
    const response = await operatingSystemService
      .searchCmdbOperatingSystem(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCmdbOperatingSystemById = createAsyncThunk(
  'getCmdbOperatingSystemById',
  async (id: number) => {
    const response = await operatingSystemService.getCmdbOperatingSystemById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmdbOperatingSystem = createAsyncThunk(
  'saveCmdbOperatingSystem',
  async (data: ICmdbOperatingSystem) => {
    const response = await operatingSystemService.saveCmdbOperatingSystem(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbOperatingSystem = createAsyncThunk(
  'deleteCmdbOperatingSystem',
  async (id: number) => {
    const response = await operatingSystemService.deleteCmdbOperatingSystem(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
