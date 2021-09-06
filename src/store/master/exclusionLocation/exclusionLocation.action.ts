import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigExclusionLocation,
  ISearchConfigExclusionLocation,
} from '../../../services/master/exclusionLocation/exclusionLocation.model';
import exclusionLocationService from '../../../services/master/exclusionLocation/exclusionLocation.service';

// Asynchronous thunk action

export const searchConfigExclusionLocation = createAsyncThunk(
  'searchConfigExclusionLocation',
  async (searchParam?: ISearchConfigExclusionLocation) => {
    const response = await exclusionLocationService
      .searchConfigExclusionLocation(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigExclusionLocationById = createAsyncThunk(
  'getConfigExclusionLocationById',
  async (id: number) => {
    const response = await exclusionLocationService
      .getConfigExclusionLocationById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigExclusionLocation = createAsyncThunk(
  'saveConfigExclusionLocation',
  async (data: IConfigExclusionLocation) => {
    const response = await exclusionLocationService
      .saveConfigExclusionLocation(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigExclusionLocation = createAsyncThunk(
  'deleteConfigExclusionLocation',
  async (id: number) => {
    const response = await exclusionLocationService
      .deleteConfigExclusionLocation(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
