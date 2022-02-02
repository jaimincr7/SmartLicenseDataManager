import {
  IDeleteDataset,
  ISearchDeleteDataset,
} from '../../../services/master/deleteDataset/deleteDataset.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import DeleteDatasetService from '../../../services/master/deleteDataset/deleteDataset.service';

// Asynchronous thunk action

export const searchDeleteDataset = createAsyncThunk(
  'searchDeleteDataset',
  async (searchParam?: ISearchDeleteDataset) => {
    const response = await DeleteDatasetService.searchDeleteDataset(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getDeleteDatasetById = createAsyncThunk('getDeleteDatasetById', async (id: number) => {
  const response = await DeleteDatasetService.getDeleteDatasetById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveDeleteDataset = createAsyncThunk(
  'saveDeleteDataset',
  async (data: IDeleteDataset) => {
    const response = await DeleteDatasetService.saveDeleteDataset(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteDeleteDataset = createAsyncThunk('deleteDeleteDataset', async (id: number) => {
  const response = await DeleteDatasetService.deleteDeleteDataset(id).then((res) => {
    return res.body;
  });
  return response;
});
