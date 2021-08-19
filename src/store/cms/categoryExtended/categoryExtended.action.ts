import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmsCategoryExtended,
  ISearchCmsCategoryExtended,
} from '../../../services/cms/categoryExtended/categoryExtended.model';
import categoryExtendedService from '../../../services/cms/categoryExtended/categoryExtended.service';

// Asynchronous thunk action

export const searchCmsCategoryExtended = createAsyncThunk(
  'searchCmsCategoryExtended',
  async (searchParam?: ISearchCmsCategoryExtended) => {
    const response = await categoryExtendedService
      .searchCmsCategoryExtended(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCmsCategoryExtendedById = createAsyncThunk(
  'getCmsCategoryExtendedById',
  async (id: number) => {
    const response = await categoryExtendedService.getCmsCategoryExtendedById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmsCategoryExtended = createAsyncThunk(
  'saveCmsCategoryExtended',
  async (data: ICmsCategoryExtended) => {
    const response = await categoryExtendedService.saveCmsCategoryExtended(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmsCategoryExtended = createAsyncThunk(
  'deleteCmsCategoryExtended',
  async (id: number) => {
    const response = await categoryExtendedService.deleteCmsCategoryExtended(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
