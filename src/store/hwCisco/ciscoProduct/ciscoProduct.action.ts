import {
  ISearchCiscoProduct,
  ICiscoProduct,
} from '../../../services/hwCisco/ciscoProduct/ciscoProduct.model';
import siteMatrixService from '../../../services/hwCisco/ciscoProduct/ciscoProduct.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoProduct = createAsyncThunk(
  'searchCiscoProduct',
  async (searchParam?: ISearchCiscoProduct) => {
    const response = await siteMatrixService.searchCiscoProduct(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoProductById = createAsyncThunk('getCiscoProductById', async (id: number) => {
  const response = await siteMatrixService.getCiscoProductById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoProduct = createAsyncThunk(
  'saveCiscoProduct',
  async (data: ICiscoProduct) => {
    const response = await siteMatrixService.saveCiscoProduct(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCiscoProduct = createAsyncThunk('deleteCiscoProduct', async (id: number) => {
  const response = await siteMatrixService.deleteCiscoProduct(id).then((res) => {
    return res.body;
  });
  return response;
});
