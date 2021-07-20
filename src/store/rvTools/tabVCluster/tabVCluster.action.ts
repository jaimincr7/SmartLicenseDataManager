import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchTabVCluster,
  ITabVCluster,
} from '../../../services/rvTools/tabVCluster/tabVCluster.model';
import tabVClusterService from '../../../services/rvTools/tabVCluster/tabVCluster.service';

// Asynchronous thunk action

export const searchTabVCluster = createAsyncThunk(
  'searchTabVCluster',
  async (searchParam?: ISearchTabVCluster) => {
    const response = await tabVClusterService.searchTabVCluster(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getTabVClusterById = createAsyncThunk('getTabVClusterById', async (id: number) => {
  const response = await tabVClusterService.getTabVClusterById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveTabVCluster = createAsyncThunk('saveTabVCluster', async (data: ITabVCluster) => {
  const response = await tabVClusterService.saveTabVCluster(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteTabVCluster = createAsyncThunk('deleteTabVCluster', async (id: number) => {
  const response = await tabVClusterService.deleteTabVCluster(id).then((res) => {
    return res.body;
  });
  return response;
});
