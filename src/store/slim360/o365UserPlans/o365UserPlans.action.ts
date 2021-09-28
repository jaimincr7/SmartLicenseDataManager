import {
  ISearchSlim360O365UserPlans,
  ISlim360O365UserPlans,
} from '../../../services/slim360/o365UserPlans/o365UserPlans.model';
import o365UserPlansService from '../../../services/slim360/o365UserPlans/o365UserPlans.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchSlim360O365UserPlans = createAsyncThunk(
  'searchSlim360O365UserPlans',
  async (searchParam?: ISearchSlim360O365UserPlans) => {
    const response = await o365UserPlansService
      .searchSlim360O365UserPlans(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSlim360O365UserPlansById = createAsyncThunk(
  'getSlim360O365UserPlansById',
  async (id: number) => {
    const response = await o365UserPlansService.getSlim360O365UserPlansById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveSlim360O365UserPlans = createAsyncThunk(
  'saveSlim360O365UserPlans',
  async (data: ISlim360O365UserPlans) => {
    const response = await o365UserPlansService.saveSlim360O365UserPlans(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteSlim360O365UserPlans = createAsyncThunk(
  'deleteSlim360O365UserPlans',
  async (id: number) => {
    const response = await o365UserPlansService.deleteSlim360O365UserPlans(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
