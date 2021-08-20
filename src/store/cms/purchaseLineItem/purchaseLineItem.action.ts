import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ICmsPurchaseLineItem,
  ISearchCmsPurchaseLineItem,
} from '../../../services/cms/purchaseLineItem/purchaseLineItem.model';
import purchaseLineItemService from '../../../services/cms/purchaseLineItem/purchaseLineItem.service';

// Asynchronous thunk action

export const searchCmsPurchaseLineItem = createAsyncThunk(
  'searchCmsPurchaseLineItem',
  async (searchParam?: ISearchCmsPurchaseLineItem) => {
    const response = await purchaseLineItemService
      .searchCmsPurchaseLineItem(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getCmsPurchaseLineItemById = createAsyncThunk(
  'getCmsPurchaseLineItemById',
  async (id: number) => {
    const response = await purchaseLineItemService.getCmsPurchaseLineItemById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveCmsPurchaseLineItem = createAsyncThunk(
  'saveCmsPurchaseLineItem',
  async (data: ICmsPurchaseLineItem) => {
    const response = await purchaseLineItemService.saveCmsPurchaseLineItem(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteCmsPurchaseLineItem = createAsyncThunk(
  'deleteCmsPurchaseLineItem',
  async (id: number) => {
    const response = await purchaseLineItemService.deleteCmsPurchaseLineItem(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
