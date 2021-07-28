import {
  ISearchCiscoSiteMatrix,
  ICiscoSiteMatrix,
} from '../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.model';
import siteMatrixService from '../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoSiteMatrix = createAsyncThunk(
  'searchCiscoSiteMatrix',
  async (searchParam?: ISearchCiscoSiteMatrix) => {
    const response = await siteMatrixService.searchCiscoSiteMatrix(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoSiteMatrixById = createAsyncThunk(
  'getCiscoSiteMatrixById',
  async (id: number) => {
    const response = await siteMatrixService.getCiscoSiteMatrixById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCiscoSiteMatrix = createAsyncThunk(
  'saveCiscoSiteMatrix',
  async (data: ICiscoSiteMatrix) => {
    const response = await siteMatrixService.saveCiscoSiteMatrix(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCiscoSiteMatrix = createAsyncThunk(
  'deleteCiscoSiteMatrix',
  async (id: number) => {
    const response = await siteMatrixService.deleteCiscoSiteMatrix(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
