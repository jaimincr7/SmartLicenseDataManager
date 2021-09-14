import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigOnlineServicePlans,
  ISearchConfigOnlineServicePlans,
} from '../../../services/master/onlineServicePlans/onlineServicePlans.model';
import onlineServicePlansService from '../../../services/master/onlineServicePlans/onlineServicePlans.service';

// Asynchronous thunk action

export const searchConfigOnlineServicePlans = createAsyncThunk(
  'searchConfigOnlineServicePlans',
  async (searchParam?: ISearchConfigOnlineServicePlans) => {
    const response = await onlineServicePlansService
      .searchConfigOnlineServicePlans(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigOnlineServicePlansById = createAsyncThunk(
  'getConfigOnlineServicePlansById',
  async (id: number) => {
    const response = await onlineServicePlansService
      .getConfigOnlineServicePlansById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveConfigOnlineServicePlans = createAsyncThunk(
  'saveConfigOnlineServicePlans',
  async (data: IConfigOnlineServicePlans) => {
    const response = await onlineServicePlansService
      .saveConfigOnlineServicePlans(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteConfigOnlineServicePlans = createAsyncThunk(
  'deleteConfigOnlineServicePlans',
  async (id: number) => {
    const response = await onlineServicePlansService
      .deleteConfigOnlineServicePlans(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
