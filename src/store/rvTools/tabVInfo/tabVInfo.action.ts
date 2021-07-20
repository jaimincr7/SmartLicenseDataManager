import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchTabVInfo, ITabVInfo } from '../../../services/rvTools/tabVInfo/tabVInfo.model';
import tabVInfoService from '../../../services/rvTools/tabVInfo/tabVInfo.service';

// Asynchronous thunk action

export const searchTabVInfo = createAsyncThunk(
  'searchTabVInfo',
  async (searchParam?: ISearchTabVInfo) => {
    const response = await tabVInfoService.searchTabVInfo(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getTabVInfoById = createAsyncThunk('getTabVInfoById', async (id: number) => {
  const response = await tabVInfoService.getTabVInfoById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveTabVInfo = createAsyncThunk('saveTabVInfo', async (data: ITabVInfo) => {
  const response = await tabVInfoService.saveTabVInfo(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteTabVInfo = createAsyncThunk('deleteTabVInfo', async (id: number) => {
  const response = await tabVInfoService.deleteTabVInfo(id).then((res) => {
    return res.body;
  });
  return response;
});
