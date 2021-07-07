import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchWindowsServerPricing,
  IWindowsServerPricing,
} from '../../../services/windowsServer/windowsServerPricing/windowsServerPricing.model';
import windowsServerPricingService from '../../../services/windowsServer/windowsServerPricing/windowsServerPricing.service';

// Asynchronous thunk action

export const searchWindowsServerPricing = createAsyncThunk(
  'searchWindowsServerPricing',
  async (searchParam?: ISearchWindowsServerPricing) => {
    const response = await windowsServerPricingService
      .searchWindowsServerPricing(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getWindowsServerPricingById = createAsyncThunk(
  'getWindowsServerPricingById',
  async (id: number) => {
    const response = await windowsServerPricingService
      .getWindowsServerPricingById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveWindowsServerPricing = createAsyncThunk(
  'saveWindowsServerPricing',
  async (data: IWindowsServerPricing) => {
    const response = await windowsServerPricingService
      .saveWindowsServerPricing(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteWindowsServerPricing = createAsyncThunk(
  'deleteWindowsServerPricing',
  async (id: number) => {
    const response = await windowsServerPricingService
      .deleteWindowsServerPricing(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
