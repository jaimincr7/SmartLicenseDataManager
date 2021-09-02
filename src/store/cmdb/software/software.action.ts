import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmdbSoftware, ISearchCmdbSoftware } from '../../../services/cmdb/software/software.model';
import softwareService from '../../../services/cmdb/software/software.service';

// Asynchronous thunk action

export const searchCmdbSoftware = createAsyncThunk(
  'searchCmdbSoftware',
  async (searchParam?: ISearchCmdbSoftware) => {
    const response = await softwareService.searchCmdbSoftware(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmdbSoftwareById = createAsyncThunk('getCmdbSoftwareById', async (id: number) => {
  const response = await softwareService.getCmdbSoftwareById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmdbSoftware = createAsyncThunk(
  'saveCmdbSoftware',
  async (data: ICmdbSoftware) => {
    const response = await softwareService.saveCmdbSoftware(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmdbSoftware = createAsyncThunk('deleteCmdbSoftware', async (id: number) => {
  const response = await softwareService.deleteCmdbSoftware(id).then((res) => {
    return res.body;
  });
  return response;
});
