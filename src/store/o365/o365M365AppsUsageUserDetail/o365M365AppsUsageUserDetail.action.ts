import {
  ISearchO365M365AppsUsageUserDetail,
  IO365M365AppsUsageUserDetail,
} from '../../../services/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.model';
import o365M365AppsUsageUserDetailService from '../../../services/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchO365M365AppsUsageUserDetail = createAsyncThunk(
  'searchO365M365AppsUsageUserDetail',
  async (searchParam?: ISearchO365M365AppsUsageUserDetail) => {
    const response = await o365M365AppsUsageUserDetailService
      .searchO365M365AppsUsageUserDetail(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getO365M365AppsUsageUserDetailById = createAsyncThunk(
  'getO365M365AppsUsageUserDetailById',
  async (id: number) => {
    const response = await o365M365AppsUsageUserDetailService
      .getO365M365AppsUsageUserDetailById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveO365M365AppsUsageUserDetail = createAsyncThunk(
  'saveO365M365AppsUsageUserDetail',
  async (data: IO365M365AppsUsageUserDetail) => {
    const response = await o365M365AppsUsageUserDetailService
      .saveO365M365AppsUsageUserDetail(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteO365M365AppsUsageUserDetail = createAsyncThunk(
  'deleteO365M365AppsUsageUserDetail',
  async (id: number) => {
    const response = await o365M365AppsUsageUserDetailService
      .deleteO365M365AppsUsageUserDetail(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
