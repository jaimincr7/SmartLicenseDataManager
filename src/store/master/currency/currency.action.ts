import { ICurrency, ISearchCurrency } from '../../../services/master/currency/currency.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import currencyService from '../../../services/master/currency/currency.service';

// Asynchronous thunk action

export const searchCurrency = createAsyncThunk(
  'searchCurrency',
  async (searchParam?: ISearchCurrency) => {
    const response = await currencyService.searchCurrency(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCurrencyById = createAsyncThunk('getCurrencyById', async (id: number) => {
  const response = await currencyService.getCurrencyById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCurrency = createAsyncThunk('saveCurrency', async (data: ICurrency) => {
  const response = await currencyService.saveCurrency(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCurrency = createAsyncThunk('deleteCurrency', async (id: number) => {
  const response = await currencyService.deleteCurrency(id).then((res) => {
    return res.body;
  });
  return response;
});
