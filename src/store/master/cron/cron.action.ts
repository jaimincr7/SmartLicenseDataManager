import { ICronData, ISearchCron, IStartApi } from '../../../services/master/cron/cron.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import cronService from '../../../services/master/cron/cron.service';

// Asynchronous thunk action

export const searchCron = createAsyncThunk('searchCron', async (searchParam?: ISearchCron) => {
  const response = await cronService.searchCron(searchParam).then((res) => {
    return res.body;
  });
  return response.data;
});

export const startAll = createAsyncThunk('startAll', async (searchParam?: ISearchCron) => {
  const response = await cronService.startAll(searchParam).then((res) => {
    return res.body;
  });
  return response;
});

// export const startApi = createAsyncThunk('startApi', async (searchParam?: IStartApi) => {
//   const response = await cronService.startApi(searchParam).then((res) => {
//     return res.body;
//   });
//   return response.data;
// });

export const getCronById = createAsyncThunk('getCronById', async (id: number) => {
  const response = await cronService.getCronById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getFrequencyDay = createAsyncThunk('getFrequencyDay', async () => {
  const response = await cronService.getFrequencyDay().then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCron = createAsyncThunk('saveCron', async (data: ICronData) => {
  const response = await cronService.saveCron(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCron = createAsyncThunk('deleteCron', async (id: number) => {
  const response = await cronService.deleteCron(id).then((res) => {
    return res.body;
  });
  return response;
});

export const startApi = createAsyncThunk('startApi', async (data: IStartApi) => {
  const response = await cronService.startApi(data).then((res) => {
    return res.body;
  });
  return response;
});

export const stopApi = createAsyncThunk('stopApi', async (id?: number) => {
  const response = await cronService.stopApi(id).then((res) => {
    return res.body;
  });
  return response;
});
