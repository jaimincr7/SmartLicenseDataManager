import {
  ISearchCiscoSpectrum,
  ICiscoSpectrum,
} from '../../../services/hwCisco/ciscoSpectrum/ciscoSpectrum.model';
import siteMatrixService from '../../../services/hwCisco/ciscoSpectrum/ciscoSpectrum.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchCiscoSpectrum = createAsyncThunk(
  'searchCiscoSpectrum',
  async (searchParam?: ISearchCiscoSpectrum) => {
    const response = await siteMatrixService.searchCiscoSpectrum(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCiscoSpectrumById = createAsyncThunk('getCiscoSpectrumById', async (id: number) => {
  const response = await siteMatrixService.getCiscoSpectrumById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCiscoSpectrum = createAsyncThunk(
  'saveCiscoSpectrum',
  async (data: ICiscoSpectrum) => {
    const response = await siteMatrixService.saveCiscoSpectrum(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCiscoSpectrum = createAsyncThunk('deleteCiscoSpectrum', async (id: number) => {
  const response = await siteMatrixService.deleteCiscoSpectrum(id).then((res) => {
    return res.body;
  });
  return response;
});
