import {
  ISearchO365ActivationsUserDetail,
  IO365ActivationsUserDetail,
} from '../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.model';
import o365ActivationsUserDetailService from '../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchO365ActivationsUserDetail = createAsyncThunk(
  'searchO365ActivationsUserDetail',
  async (searchParam?: ISearchO365ActivationsUserDetail) => {
    const response = await o365ActivationsUserDetailService
      .searchO365ActivationsUserDetail(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getO365ActivationsUserDetailById = createAsyncThunk(
  'getO365ActivationsUserDetailById',
  async (id: number) => {
    const response = await o365ActivationsUserDetailService
      .getO365ActivationsUserDetailById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveO365ActivationsUserDetail = createAsyncThunk(
  'saveO365ActivationsUserDetail',
  async (data: IO365ActivationsUserDetail) => {
    const response = await o365ActivationsUserDetailService
      .saveO365ActivationsUserDetail(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteO365ActivationsUserDetail = createAsyncThunk(
  'deleteO365ActivationsUserDetail',
  async (id: number) => {
    const response = await o365ActivationsUserDetailService
      .deleteO365ActivationsUserDetail(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
