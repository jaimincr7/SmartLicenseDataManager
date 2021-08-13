import {
  ISearchCiscoProductAttributes,
  ICiscoProductAttributes,
} from '../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.model';
import siteMatrixService from '../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoProductAttributes = createAsyncThunk(
  'searchCiscoProductAttributes',
  async (searchParam?: ISearchCiscoProductAttributes) => {
    const response = await siteMatrixService
      .searchCiscoProductAttributes(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCiscoProductAttributesById = createAsyncThunk(
  'getCiscoProductAttributesById',
  async (id: number) => {
    const response = await siteMatrixService.getCiscoProductAttributesById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCiscoProductAttributes = createAsyncThunk(
  'saveCiscoProductAttributes',
  async (data: ICiscoProductAttributes) => {
    const response = await siteMatrixService.saveCiscoProductAttributes(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCiscoProductAttributes = createAsyncThunk(
  'deleteCiscoProductAttributes',
  async (id: number) => {
    const response = await siteMatrixService.deleteCiscoProductAttributes(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
