import {
  IConfigO365Products,
  ISearchConfigO365Products,
} from '../../../services/master/configO365Products/configO365Products.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import configO365ProductsService from '../../../services/master/configO365Products/configO365Products.service';

// Asynchronous thunk action

export const searchConfigO365Products = createAsyncThunk(
  'searchConfigO365Products',
  async (searchParam?: ISearchConfigO365Products) => {
    const response = await configO365ProductsService
      .searchConfigO365Products(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigO365ProductsById = createAsyncThunk(
  'getConfigO365ProductsById',
  async (id: number) => {
    const response = await configO365ProductsService.getConfigO365ProductsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigO365Products = createAsyncThunk(
  'saveConfigO365Products',
  async (data: IConfigO365Products) => {
    const response = await configO365ProductsService.saveConfigO365Products(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigO365Products = createAsyncThunk(
  'deleteConfigO365Products',
  async (id: number) => {
    const response = await configO365ProductsService.deleteConfigO365Products(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
