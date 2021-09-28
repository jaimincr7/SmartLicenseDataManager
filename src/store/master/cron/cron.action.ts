import { ISearchCron, IStartApi } from '../../../services/master/cron/cron.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import cronService from '../../../services/master/cron/cron.service';

// Asynchronous thunk action

export const searchCron = createAsyncThunk('searchCron', async (searchParam?: ISearchCron) => {
  const response = await cronService.searchCron(searchParam).then((res) => {
    return res.body;
  });
  return response.data;
});

// export const startApi = createAsyncThunk('startApi', async (searchParam?: IStartApi) => {
//   const response = await cronService.startApi(searchParam).then((res) => {
//     return res.body;
//   });
//   return response.data;
// });

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
