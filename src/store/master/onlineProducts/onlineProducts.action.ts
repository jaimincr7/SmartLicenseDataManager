import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IConfigOnlineProducts,
  ISearchConfigOnlineProducts,
} from '../../../services/master/onlineProducts/onlineProducts.model';
import onlineProductsService from '../../../services/master/onlineProducts/onlineProducts.service';

// Asynchronous thunk action

export const searchConfigOnlineProducts = createAsyncThunk(
  'searchConfigOnlineProducts',
  async (searchParam?: ISearchConfigOnlineProducts) => {
    const response = await onlineProductsService
      .searchConfigOnlineProducts(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getConfigOnlineProductsById = createAsyncThunk(
  'getConfigOnlineProductsById',
  async (id: number) => {
    const response = await onlineProductsService.getConfigOnlineProductsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveConfigOnlineProducts = createAsyncThunk(
  'saveConfigOnlineProducts',
  async (data: IConfigOnlineProducts) => {
    const response = await onlineProductsService.saveConfigOnlineProducts(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteConfigOnlineProducts = createAsyncThunk(
  'deleteConfigOnlineProducts',
  async (id: number) => {
    const response = await onlineProductsService.deleteConfigOnlineProducts(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
