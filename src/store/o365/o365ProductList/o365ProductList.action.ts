import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IO365ProductList,
  ISearchO365ProductList,
} from '../../../services/o365/o365ProductList/o365ProductList.model';
import o365ProductListService from '../../../services/o365/o365ProductList/o365ProductList.service';

export const searchO365ProductList = createAsyncThunk(
  'searchO365ProductList',
  async (searchParam?: ISearchO365ProductList) => {
    const response = await o365ProductListService.searchO365ProductList(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getO365ProductListById = createAsyncThunk(
  'getO365ProductListById',
  async (id: number) => {
    const response = await o365ProductListService.getO365ProductListById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveO365ProductList = createAsyncThunk(
  'saveO365ProductList',
  async (data: IO365ProductList) => {
    const response = await o365ProductListService.saveO365ProductList(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteO365ProductList = createAsyncThunk(
  'deleteO365ProductList',
  async (id: number) => {
    const response = await o365ProductListService.deleteO365ProductList(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
