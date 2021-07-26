import {
  ISearchO365ActiveUserDetail,
  IO365ActiveUserDetail,
} from '../../../services/o365/o365ActiveUserDetail/o365ActiveUserDetail.model';
import o365ActiveUserDetailService from '../../../services/o365/o365ActiveUserDetail/o365ActiveUserDetail.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchO365ActiveUserDetail = createAsyncThunk(
  'searchO365ActiveUserDetail',
  async (searchParam?: ISearchO365ActiveUserDetail) => {
    const response = await o365ActiveUserDetailService
      .searchO365ActiveUserDetail(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getO365ActiveUserDetailById = createAsyncThunk(
  'getO365ActiveUserDetailById',
  async (id: number) => {
    const response = await o365ActiveUserDetailService
      .getO365ActiveUserDetailById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveO365ActiveUserDetail = createAsyncThunk(
  'saveO365ActiveUserDetail',
  async (data: IO365ActiveUserDetail) => {
    const response = await o365ActiveUserDetailService
      .saveO365ActiveUserDetail(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteO365ActiveUserDetail = createAsyncThunk(
  'deleteO365ActiveUserDetail',
  async (id: number) => {
    const response = await o365ActiveUserDetailService
      .deleteO365ActiveUserDetail(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
