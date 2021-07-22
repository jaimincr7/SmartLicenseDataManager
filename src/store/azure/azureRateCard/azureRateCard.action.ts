import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchAzureRateCard,
  IAzureRateCard,
} from '../../../services/azure/azureRateCard/azureRateCard.model';
import azureRateCardService from '../../../services/azure/azureRateCard/azureRateCard.service';

// Asynchronous thunk action

export const searchAzureRateCard = createAsyncThunk(
  'searchAzureRateCard',
  async (searchParam?: ISearchAzureRateCard) => {
    const response = await azureRateCardService.searchAzureRateCard(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getAzureRateCardById = createAsyncThunk('getAzureRateCardById', async (id: number) => {
  const response = await azureRateCardService.getAzureRateCardById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveAzureRateCard = createAsyncThunk(
  'saveAzureRateCard',
  async (data: IAzureRateCard) => {
    const response = await azureRateCardService.saveAzureRateCard(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteAzureRateCard = createAsyncThunk('deleteAzureRateCard', async (id: number) => {
  const response = await azureRateCardService.deleteAzureRateCard(id).then((res) => {
    return res.body;
  });
  return response;
});
