import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmsPurchase, ISearchCmsPurchase } from '../../../services/cms/purchase/purchase.model';
import purchaseService from '../../../services/cms/purchase/purchase.service';

// Asynchronous thunk action

export const searchCmsPurchase = createAsyncThunk(
  'searchCmsPurchase',
  async (searchParam?: ISearchCmsPurchase) => {
    const response = await purchaseService.searchCmsPurchase(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmsPurchaseById = createAsyncThunk('getCmsPurchaseById', async (id: number) => {
  const response = await purchaseService.getCmsPurchaseById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmsPurchase = createAsyncThunk('saveCmsPurchase', async (data: ICmsPurchase) => {
  const response = await purchaseService.saveCmsPurchase(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmsPurchase = createAsyncThunk('deleteCmsPurchase', async (id: number) => {
  const response = await purchaseService.deleteCmsPurchase(id).then((res) => {
    return res.body;
  });
  return response;
});
