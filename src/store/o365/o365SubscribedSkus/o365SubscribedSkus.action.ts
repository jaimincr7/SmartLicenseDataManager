import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IO365SubscribedSkus,
  ISearchO365SubscribedSkus,
} from '../../../services/o365/o365SubscribedSkus/o365SubscribedSkus.model';
import O365SubscribedSkusService from '../../../services/o365/o365SubscribedSkus/o365SubscribedSkus.service';

export const searchO365SubscribedSkus = createAsyncThunk(
  'searchO365SubscribedSkus',
  async (searchParam?: ISearchO365SubscribedSkus) => {
    const response = await O365SubscribedSkusService.searchO365SubscribedSkus(searchParam).then(
      (res) => {
        return res.body;
      }
    );
    return response.data;
  }
);

export const getO365SubscribedSkusById = createAsyncThunk(
  'getO365SubscribedSkusById',
  async (id: number) => {
    const response = await O365SubscribedSkusService.getO365SubscribedSkusById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveO365SubscribedSkus = createAsyncThunk(
  'saveO365SubscribedSkus',
  async (data: IO365SubscribedSkus) => {
    const response = await O365SubscribedSkusService.saveO365SubscribedSkus(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteO365SubscribedSkus = createAsyncThunk(
  'deleteO365SubscribedSkus',
  async (id: number) => {
    const response = await O365SubscribedSkusService.deleteO365SubscribedSkus(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
