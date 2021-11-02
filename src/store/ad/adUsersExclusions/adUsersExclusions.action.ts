import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IAdUsersExclusions,
  ISearchAdUsersExclusions,
} from '../../../services/ad/adUsersExclusions/adUsersExclusions.model';
import adUsersExclusionsService from '../../../services/ad/adUsersExclusions/adUsersExclusions.service';

// Asynchronous thunk action

export const searchAdUsersExclusion = createAsyncThunk(
  'searchAdUsersExclusion',
  async (searchParam?: ISearchAdUsersExclusions) => {
    const response = await adUsersExclusionsService
      .searchAdUsersExclusions(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getAdUsersExclusionById = createAsyncThunk(
  'getAdUsersExclusionById',
  async (id: number) => {
    const response = await adUsersExclusionsService.getAdUsersExclusionById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAdUsersExclusionsFieldLookup = createAsyncThunk(
  'getAdUsersExclusionsFieldLookup',
  async () => {
    const response = await adUsersExclusionsService.getAdUsersExclusionFieldLookup().then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveAdUsersExclusion = createAsyncThunk(
  'saveAdUsersExclusion',
  async (data: IAdUsersExclusions) => {
    const response = await adUsersExclusionsService.saveAdUsersExclusion(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteAdUsersExclusion = createAsyncThunk(
  'deleteAdUsersExclusion',
  async (id: number) => {
    const response = await adUsersExclusionsService.deleteAdUsersExclusion(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
