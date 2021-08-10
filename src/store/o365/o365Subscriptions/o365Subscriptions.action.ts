import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IO365Subscriptions,
  ISearchO365Subscriptions,
} from '../../../services/o365/o365Subscriptions/o365Subscriptions.model';
import O365SubscriptionsService from '../../../services/o365/o365Subscriptions/o365Subscriptions.service';

export const searchO365Subscriptions = createAsyncThunk(
  'searchO365Subscriptions',
  async (searchParam?: ISearchO365Subscriptions) => {
    const response = await O365SubscriptionsService.searchO365Subscriptions(searchParam).then(
      (res) => {
        return res.body;
      }
    );
    return response.data;
  }
);

export const getO365SubscriptionsById = createAsyncThunk(
  'getO365SubscriptionsById',
  async (id: number) => {
    const response = await O365SubscriptionsService.getO365SubscriptionsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveO365Subscriptions = createAsyncThunk(
  'saveO365Subscriptions',
  async (data: IO365Subscriptions) => {
    const response = await O365SubscriptionsService.saveO365Subscriptions(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteO365Subscriptions = createAsyncThunk(
  'deleteO365Subscriptions',
  async (id: number) => {
    const response = await O365SubscriptionsService.deleteO365Subscriptions(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
