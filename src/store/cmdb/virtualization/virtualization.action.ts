import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmdbVirtualization,
  ISearchCmdbVirtualization,
} from '../../../services/cmdb/virtualization/virtualization.model';
import virtualizationService from '../../../services/cmdb/virtualization/virtualization.service';

// Asynchronous thunk action

export const searchCmdbVirtualization = createAsyncThunk(
  'searchCmdbVirtualization',
  async (searchParam?: ISearchCmdbVirtualization) => {
    const response = await virtualizationService
      .searchCmdbVirtualization(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCmdbVirtualizationById = createAsyncThunk(
  'getCmdbVirtualizationById',
  async (id: number) => {
    const response = await virtualizationService.getCmdbVirtualizationById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmdbVirtualization = createAsyncThunk(
  'saveCmdbVirtualization',
  async (data: ICmdbVirtualization) => {
    const response = await virtualizationService.saveCmdbVirtualization(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbVirtualization = createAsyncThunk(
  'deleteCmdbVirtualization',
  async (id: number) => {
    const response = await virtualizationService.deleteCmdbVirtualization(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
