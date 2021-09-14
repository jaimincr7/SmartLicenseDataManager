import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigOnlineProductServicePlans,
  ISearchConfigOnlineProductServicePlans,
} from '../../../services/master/onlineProductServicePlans/onlineProductServicePlans.model';
import onlineProductServicePlansService from '../../../services/master/onlineProductServicePlans/onlineProductServicePlans.service';

// Asynchronous thunk action

export const searchConfigOnlineProductServicePlans = createAsyncThunk(
  'searchConfigOnlineProductServicePlans',
  async (searchParam?: ISearchConfigOnlineProductServicePlans) => {
    const response = await onlineProductServicePlansService
      .searchConfigOnlineProductServicePlans(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigOnlineProductServicePlansById = createAsyncThunk(
  'getConfigOnlineProductServicePlansById',
  async (id: number) => {
    const response = await onlineProductServicePlansService
      .getConfigOnlineProductServicePlansById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigOnlineProductServicePlans = createAsyncThunk(
  'saveConfigOnlineProductServicePlans',
  async (data: IConfigOnlineProductServicePlans) => {
    const response = await onlineProductServicePlansService
      .saveConfigOnlineProductServicePlans(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigOnlineProductServicePlans = createAsyncThunk(
  'deleteConfigOnlineProductServicePlans',
  async (id: number) => {
    const response = await onlineProductServicePlansService
      .deleteConfigOnlineProductServicePlans(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
