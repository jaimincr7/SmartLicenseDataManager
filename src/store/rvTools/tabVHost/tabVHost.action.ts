import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchTabVHost, ITabVHost } from '../../../services/rvTools/tabVHost/tabVHost.model';
import tabVHostService from '../../../services/rvTools/tabVHost/tabVHost.service';

// Asynchronous thunk action

export const searchTabVHost = createAsyncThunk(
  'searchTabVHost',
  async (searchParam?: ISearchTabVHost) => {
    const response = await tabVHostService.searchTabVHost(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getTabVHostById = createAsyncThunk('getTabVHostById', async (id: number) => {
  const response = await tabVHostService.getTabVHostById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveTabVHost = createAsyncThunk('saveTabVHost', async (data: ITabVHost) => {
  const response = await tabVHostService.saveTabVHost(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteTabVHost = createAsyncThunk('deleteTabVHost', async (id: number) => {
  const response = await tabVHostService.deleteTabVHost(id).then((res) => {
    return res.body;
  });
  return response;
});
